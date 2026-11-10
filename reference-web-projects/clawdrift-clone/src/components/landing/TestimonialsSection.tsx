const testimonials = [
  { name: "Jonah", handle: "@jonahships_", text: "Setup OpenClaw yesterday. All I have to say is, wow. The fact that claw can just keep building upon itself just by talking to it in discord is crazy. The future is already here." },
  { name: "Dave Morin", handle: "@davemorin", text: "First time I have felt like I am living in the future since the launch of ChatGPT." },
  { name: "Aryeh Dubois", handle: "@AryehDubois", text: "Very impressed how many hard things Claw gets right. Persistent memory, persona onboarding, comms integration, heartbeats. The end result is AWESOME." },
  { name: "Therno", handle: "@therno", text: "It's running my company." },
  { name: "Mark Jaquith", handle: "@markjaquith", text: "@openclaw feels like that kind of 'just had to glue all the parts together' leap forward. Incredible experience." },
  { name: "Lyc", handle: "@lycfyi", text: "After years of AI hype, I thought nothing could faze me. Then I installed @openclaw. From nervous 'hi what can you do?' to full throttle — design, code review, taxes, PM, content pipelines... AI as teammate, not tool." },
  { name: "Nathan Clark", handle: "@nathanclark_", text: "A smart model with eyes and hands at a desk with keyboard and mouse. You message it like a coworker and it does everything a person could do." },
  { name: "Nat Eliason", handle: "@nateliason", text: "Yeah this was 1,000% worth it. Autonomously running tests on my app and capturing errors through a sentry webhook then resolving them and opening PRs... The future is here." },
  { name: "Dan Peguine", handle: "@danpeguine", text: "Your context and skills live on YOUR computer, not a walled garden. It's open source. Growing community building skills. 'Personal AI assistant' undersells it — it's a company assistant, family assistant, team tool." },
  { name: "Christoph Nakazawa", handle: "@cnakazawa", text: "OpenClaw is the first 'software' in ages for which I constantly check for new releases on GitHub. It's hard to put into words. It's a special project." },
  { name: "Abhi Katiyar", handle: "@abhi__katiyar", text: "When you experience @openclaw it gives the same kick as when we first saw the power of ChatGPT, DeepSeek, and Claude Code. A fundamental shift is happening." },
  { name: "Nick Vasiles", handle: "@nickvasiles", text: "24/7 assistant with access to its own computer. What if there were ten, or a hundred, or a thousand?? All running 24/7 in the cloud. That's the future, and we're living it today." },
  { name: "Christine Tyip", handle: "@christinetyip", text: "Just shipped my first personal AI assistant. On WhatsApp. Builds my second brain while I chat. Memory moves across agents. Personal AI is getting real." },
  { name: "Swyx", handle: "@swyx", text: "It will actually be the thing that nukes a ton of startups, not ChatGPT as people meme about. The fact that it's hackable and hostable on-prem will make sure tech like this DOMINATES." },
  { name: "Sam", handle: "@sam_power_", text: "Just got my Winix air purifier, Claude code discovered and confirmed controls working within minutes. Now handing off to my @openclaw so it can handle controlling my room's air quality." },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium mb-4">Shoutouts</span>
          <h2 className="text-3xl font-bold md:text-4xl">Loved by builders everywhere</h2>
          <p className="mt-2 text-muted-foreground">See what people are saying about OpenClaw</p>
        </div>
        <div className="mx-auto max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <div key={t.handle} className="mb-4 break-inside-avoid rounded-lg border bg-card p-5">
              <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
