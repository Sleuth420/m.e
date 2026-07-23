export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'perri-electrics-website-tradie-developer',
    title: "How I Built Perri Electrics' Website as a Tradie-Developer",
    date: '2025-05-15',
    author: 'Ricky',
    excerpt:
      'Case notes on building perrielectrics.com: what a Melbourne electrician site needs, what we skipped, and why WordPress was the right call.',
    tags: ['wordpress developer melbourne', 'electrician website', 'trade websites'],
    published: true,
    content: `
<div class="blog-content">
  <h1>How I built Perri Electrics' website as a tradie-developer</h1>

  <p class="lead">
    <a href="https://perrielectrics.com">perrielectrics.com</a> is a WordPress site for a Melbourne
    electrician. I am both their sparky peer and the person who built the site. This is what we
    prioritised and what I would do again.
  </p>

  <h2>What the business needed</h2>

  <ul>
    <li>Clear service areas and licence trust signals</li>
    <li>Mobile-friendly layout (most traffic is phones)</li>
    <li>Easy updates without calling a developer for every text change</li>
    <li>Fast enough to pass basic Core Web Vitals after image compression</li>
    <li>Contact path that works (form, not a broken mailto link)</li>
  </ul>

  <h2>Why WordPress + Elementor</h2>

  <p>
    A custom Next.js site would be faster out of the box, but the owner needs to edit service blurbs
    and photos without Git. Elementor is not perfect, but it matches how small trade businesses
    actually maintain sites. I harden admin login, backups, and updates as part of handover.
  </p>

  <h2>SEO choices</h2>

  <p>
    We focused on honest service pages, local titles, and schema that matches reality. No fake
    review stars, no "24/7" claims unless the business backs them. Google Search Console is wired
    so we can see queries like "electrician melbourne cbd" without guessing.
  </p>

  <h2>What I would skip next time</h2>

  <ul>
    <li>Twenty near-identical suburb pages with swapped city names (doorway content)</li>
    <li>Heavy animation sliders on mobile</li>
    <li>Plugin pile-ups that duplicate SEO features</li>
  </ul>

  <h2>Want something similar?</h2>

  <p>
    See <a href="/services/wordpress-developer-melbourne">WordPress developer Melbourne</a> and
    <a href="/pricing">pricing</a>, or send your current site URL via the
    <a href="/contact">contact form</a>. I will tell you if WordPress or custom code fits better.
  </p>
</div>
`.trim(),
  },
  {
    slug: 'a-grade-electrician-victoria',
    title: "What an A-Grade Electrician Can (and Can't) Do in Victoria",
    date: '2025-03-10',
    author: 'Ricky',
    excerpt:
      'A plain-English guide to what A-Grade licensed electricians in Victoria are allowed to do, what requires a specialist, and how to get a quote without the sales pitch.',
    tags: ['electrician melbourne', 'a-grade electrician', 'electrical licence victoria'],
    published: true,
    content: `
<div class="blog-content">
  <h1>What an A-Grade electrician can (and can't) do in Victoria</h1>

  <p class="lead">
    If you are hiring an electrician in Melbourne, the licence type matters. Here is what
    A-Grade actually covers, what it does not, and how I handle quotes through the contact form.
  </p>

  <h2>What A-Grade means here</h2>

  <p>
    In Victoria, electrical work must be done by a licensed electrician. An A-Grade licence is the
    standard full licence for most domestic and commercial install and repair work. It is not a
    marketing badge; Energy Safe Victoria sets the rules.
  </p>

  <h2>Work I do regularly</h2>

  <ul>
    <li>Switchboard upgrades and safety switch (RCD) installation</li>
    <li>Power points, lighting, and appliance circuits</li>
    <li>Fault finding when circuits trip or power is partial</li>
    <li>Pre-sale and rental inspection repairs</li>
    <li>Smart switch wiring and power for cameras (not always the app setup)</li>
    <li>Light commercial fit-outs within licence scope</li>
  </ul>

  <h2>When you need someone else</h2>

  <ul>
    <li><strong>Large industrial projects</strong> with dedicated project teams</li>
    <li><strong>Underground mains</strong> owned by the distributor (call the distributor first)</li>
    <li><strong>Illegal DIY</strong> someone wants signed off without proper work</li>
    <li><strong>Immediate life-threatening situations</strong>: call 000, then the electricity distributor</li>
  </ul>

  <h2>Certificates and compliance</h2>

  <p>
    Some jobs need a Certificate of Electrical Safety. I tell you before we start if your job
    requires one. Rental agents often send a list; send me the PDF through the form and I will
    quote line items.
  </p>

  <h2>How to book</h2>

  <p>
    I do not publish a phone number on this site. Use the
    <a href="/contact">contact form</a>, include suburb and photos of the switchboard if you can.
    Mark urgent if you have no power, but call 000 if there is immediate danger.
  </p>

  <p>
    More detail on <a href="/services/electrician-melbourne">electrician services in Melbourne</a>
    and <a href="/services/electrician-melbourne-cbd">CBD electrical work</a>.
  </p>
</div>
`.trim(),
  },
  {
    slug: 'why-i-became-both-electrician-and-developer',
    title: 'Why I Became Both an Electrician and a Developer',
    date: '2024-01-20',
    author: 'Ricky',
    excerpt:
      'I trained as an A-Grade electrician, then picked up web development to help clients who needed both. Here is how that happened and why it matters in Melbourne.',
    tags: ['electrician melbourne', 'web developer melbourne', 'dual trade', 'career'],
    published: true,
    content: `
<div class="blog-content">
  <h1>Why I became both an electrician and a developer</h1>

  <p class="lead">
    Most people pick one trade. I picked two because my clients kept asking for both: fix the
    switchboard <em>and</em> fix the website. This is how that started, and what it means if you
    hire me in Melbourne.
  </p>

  <h2>Starting in electrical work</h2>

  <p>
    I became an A-Grade electrician because I like work you can see and test. Wire a board, turn
    the power on, know it is safe. Victoria's licensing is not a formality; it is there because bad
    electrical work hurts people.
  </p>

  <p>On site I learned:</p>

  <ul>
    <li><strong>Fault finding when the power is out</strong> and everyone in the house is stressed</li>
    <li><strong>Reading plans and AS/NZS rules</strong>, not guessing</li>
    <li><strong>Explaining options</strong> without talking down to anyone</li>
    <li><strong>Leaving work neat</strong> because someone lives with what you install</li>
  </ul>

  <h2>Picking up web development</h2>

  <p>
    Electricians and small businesses kept asking for simple things: a contact form that works, a
    page that shows on Google, a way to take deposits. Agencies were expensive. I taught myself to
    build sites, then apps, then directories like
    <a href="https://computerrepairsnear.me">computerrepairsnear.me</a>.
  </p>

  <p>
    The skills overlap more than people think. Tracing a fault is like tracing a bug. Both trades
    need clear documentation and respect for safety, whether that is RCDs or SQL injection.
  </p>

  <h2>What clients get from the combination</h2>

  <ul>
    <li>A tradie who understands load schedules when we talk about EV chargers</li>
    <li>A developer who has been on a roof, not just in Figma</li>
    <li>One contact form instead of chasing two contractors</li>
    <li>Sites that reflect real services, like <a href="https://perrielectrics.com">perrielectrics.com</a></li>
  </ul>

  <h2>What I am not</h2>

  <p>
    I am not a 24/7 call centre. Urgent electrical jobs are booked when I can attend safely. I am
    not a massive dev shop; you work with me. If you need fifty developers, I will say so.
  </p>

  <h2>Working together</h2>

  <p>
    Electrical quotes and web projects both start on my
    <a href="/contact">contact form</a>. Tell me which problem you are solving. I will reply with
    scope, price range, or a short list of questions.
  </p>

  <p>
    Related services:
    <a href="/services/electrician-melbourne">electrician Melbourne</a>,
    <a href="/services/web-developer-melbourne">web developer Melbourne</a>,
    <a href="/projects">project portfolio</a>.
  </p>
</div>
`.trim(),
  },
];
