import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-section',
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss'
})
export class FaqSectionComponent {
  faqs: FAQ[] = [
    {
      question: 'How do I check in to Hafan Traeth?',
      answer: 'Self check-in is available with a keybox located at the side of the property for quick and easy access. The hosts will provide you with the code before your arrival.',
      isOpen: false
    },
    {
      question: 'How many people can stay at the property?',
      answer: 'Hafan Traeth can sleep up to 5 adults or 4 adults and 2 children, plus a baby in a cot (available on request). There\'s a King-size master bedroom, twin single bedroom, and a sofa bed in the large porch area.',
      isOpen: false
    },
    {
      question: 'Is parking available and how many cars can I bring?',
      answer: 'Yes! Free private parking is available on-site with space for 2 cars on the grounds, plus additional street parking outside the property. No reservation needed.',
      isOpen: false
    },
    {
      question: 'Are pets allowed at Hafan Traeth?',
      answer: 'Yes, we welcome small well-behaved dogs only. No extra charges apply. Poop bags are provided to ensure you can clean up after your pet. Please help us maintain the peaceful neighborhood environment.',
      isOpen: false
    },
    {
      question: 'How far is it from the beach?',
      answer: 'Hafan Traeth is just a 2-minute walk from Ffrith Beach and an 8-minute walk to Prestatyn Central Beach. The beautiful coastline and long promenade are right at your doorstep!',
      isOpen: false
    },
    {
      question: 'What\'s included in the kitchen?',
      answer: 'The fully equipped kitchen includes oven, stovetop, microwave, refrigerator, toaster, electric kettle, kitchenware, cleaning products, and a dining table. Perfect for self-catering holidays.',
      isOpen: false
    },
    {
      question: 'Do I need to bring bedding and towels?',
      answer: 'No! All bedding and towels are provided, so there\'s no need to pack your own. We\'ve got everything covered for your comfort.',
      isOpen: false
    },
    {
      question: 'Is there WiFi and how fast is it?',
      answer: 'Yes! Fast free WiFi at 142 Mbps is available throughout the property. It\'s suitable for streaming 4K content and making video calls on multiple devices.',
      isOpen: false
    },
    {
      question: 'What\'s nearby for dining and shopping?',
      answer: 'There are 2 pubs and shops within a short walk, plus the local high street with supermarkets, cafes, restaurants, and salons just a 5-minute drive away. The property is situated on the bus route to Prestatyn or Rhyl town.',
      isOpen: false
    },
    {
      question: 'Is smoking allowed?',
      answer: 'Smoking is not permitted inside the property. However, there is a designated outdoor smoking area available for guests who smoke.',
      isOpen: false
    },
    {
      question: 'What are the check-in and check-out times at Hafan Traeth?',
      answer: 'Check-in at Hafan Traeth is from 16:00 (4:00 PM), and check-out is until 10:00 (10:00 AM).',
      isOpen: false
    },
    {
      question: 'How many bedrooms does Hafan Traeth have?',
      answer: 'Hafan Traeth has 2 bedrooms: a King-size master bedroom and a twin single bedroom, plus a sofa bed in the large porch area.',
      isOpen: false
    },
    {
      question: 'How much does it cost to stay at Hafan Traeth?',
      answer: 'The prices at Hafan Traeth may vary depending on your stay (dates selected, length of stay, seasonal rates, etc.). Please enter your dates to see current pricing and availability.',
      isOpen: false
    },
    {
      question: 'What activities are available at Hafan Traeth?',
      answer: 'Hafan Traeth offers direct beach access with beautiful Ffrith Beach just steps away. You can enjoy coastal walks, beach activities, and exploring the scenic Welsh coastline.',
      isOpen: false
    },
    {
      question: 'How far is Hafan Traeth from the centre of Prestatyn?',
      answer: 'Hafan Traeth is 1.1 miles from the centre of Prestatyn, easily accessible by car or the local bus route.',
      isOpen: false
    },
    {
      question: 'How close to the beach is Hafan Traeth?',
      answer: 'The nearest beach (Ffrith Beach) is just 450 yards (2-minute walk) from Hafan Traeth, with Prestatyn Central Beach an 8-minute walk away.',
      isOpen: false
    },
    {
      question: 'Is Hafan Traeth popular with families?',
      answer: 'Yes, Hafan Traeth is very popular with families! The property can accommodate up to 4 adults and 2 children (plus a baby), has a private garden, and is just steps from child-friendly beaches.',
      isOpen: false
    },
    {
      question: 'What attractions are nearby?',
      answer: 'You\'re close to Bodelwyddan Castle (13 km), Llandudno Pier (39 km), and the Snowdonia mountain range with zip wire attractions. Liverpool John Lennon Airport is 76 km away.',
      isOpen: false
    }
  ];

  toggleFAQ(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}