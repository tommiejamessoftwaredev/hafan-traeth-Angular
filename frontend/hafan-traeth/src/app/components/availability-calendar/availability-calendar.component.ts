import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../interfaces/config.interface';
import { CalendarDay, BookingEvent } from '../../interfaces/calendar.interface';


@Component({
  selector: 'app-availability-calendar',
  imports: [CommonModule, FormsModule],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.scss'
})
export class AvailabilityCalendarComponent implements OnInit {
  config: AppConfig | null = null;
  
  constructor(private http: HttpClient, private configService: ConfigService) {}
  checkinDate: string = '';
  checkoutDate: string = '';
  minDate: string = '';
  showCalendar: boolean = true;
  availabilityChecked: boolean = false;
  availabilityStatus: 'available' | 'unavailable' | 'partial' | 'minimum-stay' = 'available';
  minimumStayNights: number = 2;
  pricePerNight: number | null = null;
  bookingComTotalPrice: number | null = null;
  airbnbTotalPrice: number | null = null;
  
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  dayHeaders: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Booking URLs from configuration
  bookingComUrl: string = '';
  airbnbUrl: string = '';
  
  // Real unavailable dates from iCalendar
  unavailableDates: Date[] = [];
  bookingEvents: BookingEvent[] = [];
  icalUrl: string = '';

  ngOnInit() {
    this.configService.getConfig().subscribe(config => {
      this.config = config;
      this.bookingComUrl = config.bookingComUrl;
      this.airbnbUrl = config.airbnbUrl;
      this.icalUrl = config.icalUrl;
      
      this.setMinDate();
      this.loadAvailability();
    });
    this.generateCalendar();
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onDateChange() {
    this.showCalendar = true;
    this.availabilityChecked = false;
    this.availabilityStatus = 'available'; // Reset status
    
    if (this.checkinDate && this.checkoutDate) {
      const checkin = new Date(this.checkinDate);
      const checkout = new Date(this.checkoutDate);
      
      if (checkout <= checkin) {
        this.checkoutDate = '';
      } else {
        // Auto-check availability when both dates are selected
        setTimeout(() => {
          this.checkAvailability();
        }, 100);
      }
    }
    
    this.generateCalendar();
  }

  generateCalendar() {
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
    
    const firstDay = new Date(this.currentYear, this.currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
      const isAvailable = !this.isDateUnavailable(date);
      const isSelected = this.isDateSelected(date);
      const isToday = date.getTime() === today.getTime();
      const dateStr = this.formatDateForInput(date);
      const isCheckIn = dateStr === this.checkinDate;
      const isCheckOut = dateStr === this.checkoutDate;
      const isInRange = this.isDateInRange(date);
      
      this.calendarDays.push({
        date: isCurrentMonth ? date : null,
        available: isAvailable,
        selected: isSelected,
        isToday: isToday,
        isCheckIn: isCheckIn,
        isCheckOut: isCheckOut,
        isInRange: isInRange
      });
    }
  }

  isDateUnavailable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is today or in the past
    if (date <= today) {
      return true;
    }
    
    // Check if date is in unavailable dates from iCalendar
    return this.unavailableDates.some(unavailable => 
      unavailable.toDateString() === date.toDateString()
    );
  }

  isDateSelected(date: Date): boolean {
    if (!this.checkinDate && !this.checkoutDate) return false;
    
    const checkin = this.checkinDate ? new Date(this.checkinDate) : null;
    const checkout = this.checkoutDate ? new Date(this.checkoutDate) : null;
    
    // Compare dates without time components
    const dateStr = this.formatDateForInput(date);
    
    if (checkin && dateStr === this.checkinDate) return true;
    if (checkout && dateStr === this.checkoutDate) return true;
    
    if (checkin && checkout && date > checkin && date < checkout) return true;
    
    return false;
  }

  isDateInRange(date: Date): boolean {
    if (!this.checkinDate || !this.checkoutDate) return false;
    
    const checkin = new Date(this.checkinDate);
    const checkout = new Date(this.checkoutDate);
    
    return date > checkin && date < checkout;
  }

  selectDate(day: CalendarDay) {
    if (!day.date || !day.available) return;
    
    const selectedDate = this.formatDateForInput(day.date);
    
    // Reset availability when making new selection
    this.availabilityChecked = false;
    this.availabilityStatus = 'available';
    
    if (!this.checkinDate || (this.checkinDate && this.checkoutDate)) {
      this.checkinDate = selectedDate;
      this.checkoutDate = '';
    } else {
      if (new Date(selectedDate) > new Date(this.checkinDate)) {
        this.checkoutDate = selectedDate;
        
        // Auto-check availability when both dates are selected via calendar
        setTimeout(() => {
          this.checkAvailability();
        }, 100);
      } else {
        this.checkinDate = selectedDate;
        this.checkoutDate = '';
      }
    }
    
    this.generateCalendar();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  checkAvailability() {
    if (!this.checkinDate || !this.checkoutDate) return;
    
    const checkin = new Date(this.checkinDate);
    const checkout = new Date(this.checkoutDate);
    const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check minimum stay requirement first
    if (nights < this.minimumStayNights) {
      this.availabilityStatus = 'minimum-stay';
      this.availabilityChecked = true;
      return;
    }
    
    // Check if any dates in the stay period (including check-in but excluding check-out) are unavailable
    const hasUnavailableDates = this.unavailableDates.some(unavailableDate => {
      const unavailableDateStr = unavailableDate.toDateString();
      
      // Generate all dates in the range (including check-in, excluding check-out)
      const currentDate = new Date(checkin);
      while (currentDate < checkout) {
        if (currentDate.toDateString() === unavailableDateStr) {
          return true;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return false;
    });
    
    // Alternative simpler check using date strings for more reliable comparison
    const hasUnavailableDatesAlt = this.hasUnavailableDatesInRange(this.checkinDate, this.checkoutDate);
    
    const finalHasUnavailable = hasUnavailableDates || hasUnavailableDatesAlt;
    
    this.availabilityStatus = finalHasUnavailable ? 'unavailable' : 'available';
    this.availabilityChecked = true;
  }

  hasUnavailableDatesInRange(checkinDateStr: string, checkoutDateStr: string): boolean {
    const checkin = new Date(checkinDateStr);
    const checkout = new Date(checkoutDateStr);
    const currentDate = new Date(checkin);
    
    // Check each date in the range (including check-in, excluding check-out)
    while (currentDate < checkout) {
      const currentDateStr = this.formatDateForInput(currentDate);
      
      // Check if this date is in our unavailable dates list
      const isUnavailable = this.unavailableDates.some(unavailableDate => {
        const unavailableDateStr = this.formatDateForInput(unavailableDate);
        return unavailableDateStr === currentDateStr;
      });
      
      if (isUnavailable) {
        return true;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return false;
  }

  getAvailabilityMessage(): string {
    switch (this.availabilityStatus) {
      case 'available':
        return '✓ Available for your dates!';
      case 'unavailable':
        return '✗ Not available for selected dates';
      case 'partial':
        return '⚠ Partially available';
      case 'minimum-stay':
        return `⚠ Minimum stay is ${this.minimumStayNights} nights`;
      default:
        return '';
    }
  }

  getBookingComUrl(): string {
    if (this.checkinDate && this.checkoutDate) {
      return `${this.bookingComUrl}?checkin=${this.checkinDate}&checkout=${this.checkoutDate}`;
    }
    return `${this.bookingComUrl}?checkin=2025-08-17&checkout=2025-09-16`;
  }

  getAirbnbUrl(): string {
    if (this.checkinDate && this.checkoutDate) {
      return `${this.airbnbUrl}?check_in=${this.checkinDate}&check_out=${this.checkoutDate}&guests=1&adults=2`;
    }
    return `${this.airbnbUrl}?&check_in=2025-09-01&guests=2&adults=2&check_out=2025-09-03`;
  }

  bookOnBookingCom(): void {
    const url = this.getBookingComUrl();
    window.open(url, '_blank');
  }

  bookOnAirbnb(): void {
    const url = this.getAirbnbUrl();
    window.open(url, '_blank');
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateTotalPrices(): void {
    if (!this.checkinDate || !this.checkoutDate || !this.pricePerNight) return;
    
    const checkin = new Date(this.checkinDate);
    const checkout = new Date(this.checkoutDate);
    const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return;
    
    const basePrice = this.pricePerNight * nights;
    
    // More conservative pricing - closer to actual booking site totals
    // Booking.com typically shows prices closer to base rate
    const bookingComTaxes = Math.round(basePrice * 0.05); // 5% taxes/fees
    this.bookingComTotalPrice = basePrice + bookingComTaxes;
    
    // Airbnb typically has cleaning fee and service fee
    const airbnbServiceFee = Math.round(basePrice * 0.08); // 8% service fee
    const airbnbCleaningFee = 35; // Reduced cleaning fee
    const airbnbTaxes = Math.round(basePrice * 0.05); // 5% taxes
    this.airbnbTotalPrice = basePrice + airbnbServiceFee + airbnbCleaningFee + airbnbTaxes;
    
    console.log(`Pricing calculation for ${nights} nights:`);
    console.log(`Base price: £${basePrice}`);
    console.log(`Booking.com total: £${this.bookingComTotalPrice}`);
    console.log(`Airbnb total: £${this.airbnbTotalPrice}`);
  }

  loadAvailability(): void {
    const proxyUrl = `${this.config?.apiUrl}/GetICalData`;
    
    this.http.get(proxyUrl, { responseType: 'text' })
      .subscribe({
        next: (icalData) => {
          this.parseICalData(icalData);
          this.generateCalendar();
        },
        error: (error) => {
          console.error('Error loading iCal data via proxy:', error);
          this.setFallbackUnavailableDates();
          this.generateCalendar();
        }
      });
  }

  parseICalData(icalData: string): void {
    this.bookingEvents = [];
    this.unavailableDates = [];

    const events = this.parseICalEvents(icalData);
    
    events.forEach(event => {
      this.bookingEvents.push(event);
      
      // Add all dates between start and end to unavailable dates (inclusive of start, exclusive of end)
      const currentDate = new Date(event.start);
      while (currentDate < event.end) {
        this.unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

  }

  parseICalEvents(icalData: string): BookingEvent[] {
    const events: BookingEvent[] = [];
    const lines = icalData.split('\n');
    
    let currentEvent: Partial<BookingEvent> = {};
    let inEvent = false;

    for (let line of lines) {
      line = line.trim();
      
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        currentEvent = {};
      } else if (line === 'END:VEVENT' && inEvent) {
        if (currentEvent.start && currentEvent.end) {
          events.push({
            start: currentEvent.start,
            end: currentEvent.end,
            summary: currentEvent.summary || 'Booking'
          });
        }
        inEvent = false;
      } else if (inEvent) {
        if (line.startsWith('DTSTART')) {
          const dateStr = line.split(':')[1];
          currentEvent.start = this.parseICalDate(dateStr);
        } else if (line.startsWith('DTEND')) {
          const dateStr = line.split(':')[1];
          currentEvent.end = this.parseICalDate(dateStr);
        } else if (line.startsWith('SUMMARY:')) {
          currentEvent.summary = line.substring(8);
        }
      }
    }

    return events;
  }

  parseICalDate(dateStr: string): Date {
    // Handle different iCal date formats
    if (dateStr.length === 8) {
      // YYYYMMDD format
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(dateStr.substring(6, 8));
      return new Date(year, month, day);
    } else if (dateStr.includes('T')) {
      // YYYYMMDDTHHMMSS format
      const datePart = dateStr.split('T')[0];
      return this.parseICalDate(datePart);
    }
    
    // Fallback to ISO parsing
    return new Date(dateStr);
  }

  setFallbackUnavailableDates(): void {
    // Fallback mock data if iCal loading fails
    this.unavailableDates = [
      new Date('2024-12-25'),
      new Date('2024-12-26'),
      new Date('2025-01-01'),
      new Date('2025-01-15'),
      new Date('2025-02-14')
    ];
  }
}
