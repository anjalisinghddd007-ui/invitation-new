import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client (will fail gracefully if key is not configured)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Local Knowledge Base fallback for offline/no-key usage
const localKnowledgeBase = {
  timing: "The ceremonies details are:\n- **Haldi Ceremony**: Thursday, 19 November 2026, starting at 11:00 AM.\n- **Wedding Ceremony**: Friday, 20 November 2026, starting at 6:00 PM.",
  venue: "Both events will be held at the gorgeous **Rock Yard** venue in Prayagraj, Uttar Pradesh, India.",
  dress: "Here are the dress codes:\n- **Haldi Ceremony**: Traditional Mustard Yellow, Ochre, or bright saffron colors.\n- **Wedding Ceremony**: Royal Pastel, Cream, Champagne Gold, Ivory, or Peach elegance.",
  hotel: "We recommend these hotels near Rock Yard (within 10-15 mins):\n1. **Hotel Kanha Shyam** (Premium, 4-star)\n2. **The Legend Hotel** (Boutique elegance)\n3. **Grand Continental Hotel** (Modern luxury)\nWe have blocked a limited number of rooms for out-of-town guests. Please contact Vikram Singh at +91-99999-XXXXX for booking assistance.",
  directions: "Rock Yard is located in Prayagraj. \n- **By Air**: Prayagraj Airport (IXD) is 15 km from the venue. \n- **By Train**: Prayagraj Junction (PRG) is 6 km away.\nLocal taxis and auto-rickshaws (Ola/Uber) are widely available.",
  parking: "Yes, secure guest parking is available at Rock Yard. Complimentary valet parking service will be provided during the wedding ceremony on 20 November.",
  rsvp: "You can register your attendance by scrolling down to the **RSVP Portal** on this website. Please submit your response by **October 25, 2026** so we can finalize arrangements.",
  story: "Anoop (Senior Software Engineer) and Sanya (Data Scientist) met in a bookstore cafe in October 2023 when Anoop helped Sanya reach a poetry book from the top shelf. After two years of dates, stargazing, and coding debates, Anoop proposed on a rooftop on Valentine's Day 2025. They got engaged on 10 October 2025.",
  default: "I'd love to help you with that! Feel free to ask about timings, venue locations, hotel recommendations, dress codes, parking, or how Anoop and Sanya met."
};

export async function POST(req: Request) {
  try {
    const { messages } = await resJson(req);
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No message history provided.' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1].content.toLowerCase().trim();

    // 1. If OpenAI is configured, call GPT-4o-mini
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are the "Wedding Concierge", an elegant, warm, and helpful AI assistant for Sanya and Anoop Singh's wedding.
Your tone is luxurious, polite, and romantic. Keep your answers concise (2-4 sentences where possible) and use bullet points for readability.

Wedding Details:
- Bride: Sanya
- Groom: Anoop Singh (Senior Software Engineer)
- Haldi Ceremony: Thursday, 19 November 2026, 11:00 AM
- Wedding Ceremony: Friday, 20 November 2026, 6:00 PM
- Venue: Rock Yard, Prayagraj, Uttar Pradesh, India
- Dress Codes: Haldi is Mustard Yellow / Ochre. Wedding is Royal Pastel, Ivory, Gold, or Peach.
- Accommodation: Hotel Kanha Shyam, The Legend, Grand Continental. Contact Vikram Singh (+91-99999-XXXXX) for help.
- Directions: Reach via Prayagraj Junction (PRG) train station or Prayagraj Airport (IXD). Cabs are available.
- Parking: Secure parking + valet provided inside Rock Yard.
- RSVP: Guests must RSVP by October 25, 2026 using the online RSVP form on the website.
- Love Story: Met in a bookstore cafe in Oct 2023. Anoop helped Sanya reach a book. Stargazing dates. Proposed Valentine's Day 2025 on a rooftop. Engaged 10 Oct 2025.`
            },
            ...messages
          ],
          max_tokens: 250,
          temperature: 0.7,
        });

        const reply = completion.choices[0].message?.content || localKnowledgeBase.default;
        return NextResponse.json({ reply });
      } catch (openAiError) {
        console.warn('OpenAI request failed, falling back to local engine:', openAiError);
      }
    }

    // 2. Intelligent offline fallback engine using regex mapping
    let reply = localKnowledgeBase.default;
    
    if (lastUserMessage.includes('timing') || lastUserMessage.includes('schedule') || lastUserMessage.includes('date') || lastUserMessage.includes('when')) {
      reply = localKnowledgeBase.timing;
    } else if (lastUserMessage.includes('where') || lastUserMessage.includes('venue') || lastUserMessage.includes('location') || lastUserMessage.includes('rock yard')) {
      reply = localKnowledgeBase.venue;
    } else if (lastUserMessage.includes('dress') || lastUserMessage.includes('wear') || lastUserMessage.includes('theme') || lastUserMessage.includes('clothing')) {
      reply = localKnowledgeBase.dress;
    } else if (lastUserMessage.includes('hotel') || lastUserMessage.includes('stay') || lastUserMessage.includes('accommodation') || lastUserMessage.includes('sleep') || lastUserMessage.includes('room')) {
      reply = localKnowledgeBase.hotel;
    } else if (lastUserMessage.includes('direction') || lastUserMessage.includes('reach') || lastUserMessage.includes('map') || lastUserMessage.includes('airport') || lastUserMessage.includes('cab')) {
      reply = localKnowledgeBase.directions;
    } else if (lastUserMessage.includes('park') || lastUserMessage.includes('valet') || lastUserMessage.includes('car') || lastUserMessage.includes('drive')) {
      reply = localKnowledgeBase.parking;
    } else if (lastUserMessage.includes('rsvp') || lastUserMessage.includes('attend') || lastUserMessage.includes('submit') || lastUserMessage.includes('confirm')) {
      reply = localKnowledgeBase.rsvp;
    } else if (lastUserMessage.includes('story') || lastUserMessage.includes('love') || lastUserMessage.includes('meet') || lastUserMessage.includes('propose') || lastUserMessage.includes('how did they')) {
      reply = localKnowledgeBase.story;
    } else if (lastUserMessage.includes('groom') || lastUserMessage.includes('anoop')) {
      reply = "Anoop Singh is a software engineer who loves TypeScript and writing clean code. He's incredibly excited to marry Sanya, the love of his life.";
    } else if (lastUserMessage.includes('bride') || lastUserMessage.includes('sanya')) {
      reply = "Sanya is a data scientist who writes Python scripts. She loves reading, poetry, and is excited to celebrate their future together with all of you.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

async function resJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
