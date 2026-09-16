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
    title: 'Building a WordPress Website for Perri Electrics',
    date: '2025-05-15',
    author: 'Ricky',
    excerpt:
      'How service information, mobile layouts and straightforward editing shaped the WordPress website I built for a Melbourne electrician.',
    tags: ['wordpress developer melbourne', 'electrician website', 'trade websites'],
    published: true,
    content: `
<div class="blog-content">
  <p class="lead">
    A trade business website needs to answer a few questions quickly: what work do you do,
    where do you work and how can someone request a quote? Those questions shaped the
    <a href="https://perrielectrics.com">Perri Electrics website</a> I built with WordPress and Elementor.
  </p>

  <h2>Start with the information customers need</h2>
  <p>
    The site brings together service descriptions, service areas and a way to enquire.
    My electrical background helped me organise those details around the jobs a customer
    is likely to ask about. Clear descriptions give visitors a better starting point for a quote.
  </p>

  <h2>Make everyday editing manageable</h2>
  <p>
    WordPress and Elementor let the owner update text and images without editing code.
    That matters for a business website: service details and photos change, and routine
    updates should be manageable after the site is handed over.
  </p>

  <h2>Keep the mobile experience straightforward</h2>
  <p>
    On a phone, visitors need readable text, clear navigation and an easy route to the
    contact form. Those basics take priority over extra effects that add weight or get
    between a visitor and the information they came for.
  </p>

  <h2>Plan for life after launch</h2>
  <p>
    A WordPress site needs updates, backups and attention to account access. It also needs
    content that stays accurate as the business changes. These are useful handover topics
    for any small business website.
  </p>

  <h2>Planning a trade website?</h2>
  <p>
    Start with your services, the areas you cover and the questions customers regularly ask.
    See my <a href="/services/wordpress-developer-melbourne">WordPress services</a> and
    <a href="/pricing">website packages</a>, or <a href="/contact">send an enquiry</a>
    with your current website and what you want to improve.
  </p>
</div>
`.trim(),
  },
  {
    slug: 'a-grade-electrician-victoria',
    title: 'Hiring an Electrician in Victoria: Licences and Certificates',
    date: '2025-03-10',
    author: 'Ricky',
    excerpt:
      'What to check before booking electrical work in Victoria, how safety certificates fit in and which details help when requesting a quote.',
    tags: ['electrician melbourne', 'a-grade electrician', 'electrical licence victoria'],
    published: true,
    content: `
<div class="blog-content">
  <p class="lead">
    Before booking electrical work, it helps to understand the credentials involved and
    the information your contractor needs. Here is a starting point for Melbourne homeowners
    and small businesses.
  </p>

  <h2>An electrician’s licence and contractor registration</h2>
  <p>
    A Victorian A-Grade licence allows an electrician to carry out electrical installation
    work without supervision. Contractor registration is a separate requirement for a business
    offering electrical installation work. When booking, check both the worker’s licence and
    the business’s registration. Energy Safe Victoria explains
    <a href="https://www.energysafe.vic.gov.au/community-safety/working-tradespeople/electrical-workers">what to check when hiring an electrical worker</a>.
  </p>

  <h2>Electrical safety certificates</h2>
  <p>
    A Certificate of Electrical Safety is required for all electrical installation work in
    Victoria. Some work also requires an independent inspection. Ask your contractor which
    process applies and keep the certificate with your property records. See Energy Safe
    Victoria’s <a href="https://www.energysafe.vic.gov.au/certificates-electrical-safety/obligations-and-guidelines">certificate guidance</a> for the requirements.
  </p>

  <h2>What to include in a quote request</h2>
  <ul>
    <li>Your suburb and whether the property is a house, apartment or business premises</li>
    <li>What you want installed, repaired or checked</li>
    <li>Any symptoms you have noticed, such as a circuit that keeps tripping</li>
    <li>Access restrictions, building manager requirements and preferred timing</li>
    <li>The model number of an appliance or equipment involved, if you have it</li>
  </ul>
  <p>
    You do not need to diagnose the fault yourself. Describe what you have noticed so the
    electrician can assess the next step. Some jobs can be quoted from the details provided;
    others need a visit before the scope is clear.
  </p>

  <h2>Enquire about a job</h2>
  <p>
    Read about my <a href="/services/electrician-melbourne">Melbourne electrical services</a>
    or <a href="/services/electrician-melbourne-cbd">CBD apartment and office work</a>, then
    use the <a href="/contact">contact form</a> to describe the job. If photos or documents
    would help, I’ll arrange how to share them after your enquiry. The form is not monitored
    continuously and is not an emergency service.
  </p>
</div>
`.trim(),
  },
  {
    slug: 'why-i-became-both-electrician-and-developer',
    title: 'Working as an Electrician and a Web Developer',
    date: '2024-01-20',
    author: 'Ricky',
    excerpt:
      'How my electrical background and experience running a trade business inform the websites, apps and connected devices I build.',
    tags: ['electrician melbourne', 'web developer melbourne', 'dual trade', 'career'],
    published: true,
    content: `
<div class="blog-content">
  <p class="lead">
    I’m an A-Grade electrician and a web developer in Melbourne. Through
    OakCodeAndTechSolutions, I work on electrical jobs and build websites, software and
    connected devices. The projects vary, but they share a need for careful problem solving.
  </p>

  <h2>What electrical work taught me</h2>
  <p>
    Electrical work involves understanding an existing installation, finding the cause of
    a problem and checking that the work does what it should. It also means explaining
    options clearly and leaving useful information for the next person who maintains it.
    Those habits carry into development work.
  </p>

  <h2>Understanding the business behind a website</h2>
  <p>
    Running a trade business gave me experience with quoting, scheduling and customer
    enquiries. When I build a website for a tradie, I can use that experience to ask better
    questions about services and the details needed for a quote.
    <a href="https://perrielectrics.com">Perri Electrics</a> is one example of that work.
  </p>

  <h2>Building tools for everyday work</h2>
  <p>
    Apps can help with the tasks that sit around a job: preparing quotes, tracking progress
    and keeping information together. My <a href="https://electricianapp.com.au">electrician
    management app</a> brings quotes, tasks and site calculations into one tool.
    Working in the trade gives me a practical starting point for those features.
  </p>

  <h2>Where hardware and software meet</h2>
  <p>
    Connected devices bring both backgrounds together. A monitoring system needs suitable
    hardware and a way to collect and understand its readings. I can work on the device
    software, its interface and the electrical requirements as part of the project scope.
  </p>

  <h2>Working with me</h2>
  <p>
    You can book electrical work, a website or an app as a separate project. You work directly
    with me, and we agree on the scope and timing before starting. Browse the
    <a href="/projects">project portfolio</a> or <a href="/contact">send an enquiry</a>
    describing what you need help with.
  </p>
</div>
`.trim(),
  },
];
