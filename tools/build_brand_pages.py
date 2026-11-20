#!/usr/bin/env python3
"""Generate the four brand pages and the AI & Tools page for the portfolio."""
import os, html

ROOT = '/Users/gabijasura/portfolio'

def esc(s): return html.escape(s, quote=True)

def clip(src, title, sub, frame='', reach=None):
    cls = f'lg-frame {frame}'.strip()
    if reach:
        sub = f'{sub}</span><span class="lg-reach">{reach} accounts reached'
    return (f'          <figure class="lg-clip">\n'
            f'            <div class="{cls}"><video src="{esc(src)}" muted loop playsinline preload="metadata" data-lazy></video></div>\n'
            f'            <figcaption>{title}<span>{sub}</span></figcaption>\n'
            f'          </figure>\n')

def static(slug, copy, title, reach):
    """A most-reached static ad. Shows the image if it exists, else a labelled placeholder."""
    path = f'img/top/{slug}.jpg'
    if os.path.exists(os.path.join(ROOT, path)):
        inner = f'<img src="{path}" alt="{esc(title)}" loading="lazy">'
    else:
        inner = f'<div class="lg-ph"><span>{esc(copy)}</span></div>'
    return (f'          <figure class="lg-clip">\n'
            f'            <div class="lg-frame">{inner}</div>\n'
            f'            <figcaption>{title}<span class="lg-reach">{reach} accounts reached</span></figcaption>\n'
            f'          </figure>\n')

def section(sid, kicker, h2, paras, tags, media, extra_cls='', media_cls=''):
    p = ''.join(f'          <p>{x}</p>\n' for x in paras)
    t = ''.join(f'<li>{x}</li>' for x in tags)
    mc = f'lg-media {media_cls}'.strip()
    return (f'    <section class="lg-section {extra_cls}" id="{sid}">\n'
            f'      <div class="lg-panel">\n'
            f'        <header class="lg-head">\n'
            f'          <span class="lg-kicker">{kicker}</span>\n'
            f'          <h2>{h2}</h2>\n{p}'
            f'          <ul class="lg-tags">{t}</ul>\n'
            f'        </header>\n'
            f'        <div class="{mc}">\n{media}        </div>\n'
            f'      </div>\n'
            f'    </section>\n\n')

def stats(items):
    li = ''.join(f'        <li><b>{a.replace(" ", "&nbsp;")}</b><span>{b}</span></li>\n' for a, b in items)
    return f'      <ul class="lg-stats">\n{li}      </ul>\n'

def page(fname, title, desc, h1, intro, stat_items, sections, jump):
    j = ''.join(f'      <a href="#{a}">{b}</a>\n' for a, b in jump)
    body = ''.join(sections)
    out = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Gabija Sura</title>
  <meta name="description" content="{esc(desc)}" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <canvas class="cursor-canvas"></canvas>
  <nav>
    <a href="index.html" class="nav-logo">Gabija Sura</a>
    <ul class="nav-links">
      <li><a href="work.html">Work</a></li>
      <li><a href="playground.html">Playground</a></li>
      <li><a href="about.html">About</a></li>
    </ul>
  </nav>
  <main class="proj-page">
    <div class="proj-header"><a href="work.html" class="proj-back">← Back</a></div>
    <div class="project-content">
      <span class="lg-kicker">Lcky Group · 2025–2026</span>
      <h1 class="proj-title">{h1}</h1>
      <div class="proj-text">
        <p>{intro}</p>
      </div>
{stats(stat_items)}    </div>

    <div class="lg-jump" role="navigation" aria-label="Sections">
{j}    </div>

{body}  </main>
  <footer>
    <span>Gabija Sura | <a href="mailto:gabijasura@gmail.com">gabijasura@gmail.com</a> | 2026</span>
  </footer>
  <script src="js/main.js"></script>
  <script src="js/lg-jump.js"></script>
</body>
</html>
'''
    open(os.path.join(ROOT, fname), 'w').write(out)
    print('wrote', fname)

AL = 'Reach from Meta’s public Ad Library: accounts in the EU that saw the ad at least once.'

# ── LUCKY ──
page('lucky.html', 'Lucky Casino', 'Paid social, streamer ads and display for Lucky Casino.',
  'Lucky Casino',
  'Jackpots and energy. Lucky ads are fast and loud, with tilted black text boxes, big numbers and the neon lightning bolt framing everything. I make Lucky’s paid social, streamer ads, seasonal campaigns and display banners.',
  [('967 000', 'accounts reached by my most-seen Lucky ad'), ('2.7M', 'combined reach of my four most-seen Lucky ads'), ('Weekly', 'streamer ads from the Cartmens sponsorship')],
  [
    section('top', '01 / Most reached', 'Most-seen ads', [
        'These are the Lucky ads Meta showed the most since I started: two statics and a video. The Games Global ad ran as two ads that together reached almost two million accounts.', AL],
      ['Meta 9:16', 'Static', 'Ad Library'],
      static('lucky-games-global', 'Finn din nya favorit, Games Global fest hela månaden', 'Games Global', '967 039 + 952 393') +
      clip('videos/lucky-lyckochansen-jackpots.mp4', 'Lyckochansen · Jackpot wins', 'Video 9:16', reach='513 754') +
      static('lucky-red-baron', 'Red Baron, hög spänning på hög höjd', 'Red Baron · Live Casino', '334 188')),
    section('streamer', '02 / Creator footage', 'Streamer ads', [
        'Lucky sponsors the streamer Cartmens, and I turn his raw stream footage into Meta ads. I find the biggest reaction, put the game on top and the streamer below, and pull the captions from what he actually says. In our esports campaign the video I cut brought in more in deposits than it cost to run.',
        'New streams come in every week, so I built an After Effects panel that turns one 16:9 cut into the 9:16 split and endcard automatically.'],
      ['UGC', 'A/B variants', 'After Effects'],
      clip('videos/lucky-cartmens-bull.mp4', 'Cartmens · Esports', 'Meta 9:16') +
      clip('videos/lucky-cartmens-sunken-city.mp4', 'Cartmens · Captioned', 'Meta 9:16') +
      clip('videos/lucky-svea-6-scatters-a.mp4', '6 Scatters · Version A', 'Lucky × Svea') +
      clip('videos/lucky-svea-6-scatters-b.mp4', '6 Scatters · Version B', 'Same stream, new hook')),
    section('video', '03 / Video', 'Campaigns &amp; launches', [
        'Seasonal campaigns and game launches, plus AI-built scenes for Lucky Sport where I generated full stadiums and crowds in Figma Weave and finished everything in After Effects.'],
      ['Meta', 'TikTok', 'Reddit', 'AI'],
      clip('videos/LC  - Christmas 8s V2.mp4', 'Christmas campaign', 'Meta 9:16') +
      clip('videos/lucky-octobeer.mp4', 'Octobeer Fortunes', 'Game launch · 9:16') +
      clip('videos/ai/lucky-lyckokampen.mp4', 'Lyckokampen', 'AI · Meta &amp; TikTok 9:16', reach='64 665') +
      clip('videos/ai/lucky-pl-vinnarspel.mp4', 'Premier League Vinnarspel', 'AI · Lucky Sport 9:16') +
      clip('videos/LSE-Reddit-V2.mp4', 'Reddit ad', 'Lucky Sport · 4:3', 'is-43')),
    section('display', '04 / Display', 'Display ads', [
        'Animated banners for acquisition and programmatic. One design per campaign, adapted to every size.',
        'The Hopping Kiss big-win banner got about 68 000 impressions in its first week, and 31% of viewers watched it to the end.'],
      ['Bannerflow', 'Programmatic', '320×480', '980×360', '300×600'],
      clip('videos/lucky-hopping-kiss-320x480.mp4', 'Hopping Kiss · Big win', '320×480', 'is-23') +
      '          <div class="lg-display-col">\n' +
      clip('videos/lucky-hopping-kiss-980x360.mp4', 'Hopping Kiss · Big win', '980×360', 'is-980x360') +
      '          </div>\n' +
      clip('videos/LSE-ACQ-LYCKOCHANSEN-300x600-Swedish_V1.mp4', 'Lyckochansen', '300×600', 'is-12'),
      media_cls='is-display'),
  ],
  [('top', 'Most reached'), ('streamer', 'Streamer ads'), ('video', 'Video'), ('display', 'Display')])

# ── HAPPY ──
page('happy.html', 'Happy Casino', 'Retro-gaming creative, streamer ads and game launches for Happy Casino.',
  'Happy Casino',
  'All about the games. For Halloween 2026 I turned Happy into a retro video game: Press start, Choose your player, Achievement unlocked and a Final boss. Since then it has become Happy’s language for launches and welcome offers too.',
  [('287 000', 'accounts reached by my most-seen Happy ad'), ('546 000', 'combined reach of my two most-seen Happy ads'), ('Retro', 'gaming system I created for the brand')],
  [
    section('top', '01 / Most reached', 'Most-seen ads', [
        'Happy’s most-seen ads since I started: a big-win static, and a Cartmens streamer video that ran as two ads, one of them with the welcome offer.', AL],
      ['Meta 9:16', 'Static', 'Ad Library'],
      static('happy-reactoonz', 'Reactoonz, storvinst 2 951 258 kr', 'Reactoonz · Big win', '287 111') +
      clip('videos/happy-cartmens-golden-shower.mp4', 'Cartmens · Golden Shower', 'Streamer video 9:16', reach='259 416')),
    section('retro', '02 / Brand concept', 'Retro gaming', [
        'A press-start screen, a character select with stats, achievement toasts and pixel type. Every week five games go through the same set of templates, so each one can be mixed and matched without looking the same.'],
      ['Meta', 'TikTok &amp; Snapchat', 'AI'],
      clip('videos/happy-pirots5-arcade.mp4', 'Pirots 5 · Press start', 'Game launch · 9:16') +
      clip('videos/happy-wo-valj-spelare.mp4', 'Choose your player', 'Welcome offer · 9:16') +
      clip('videos/ai/happy-games.mp4', 'Happy Games', 'AI · Meta 9:16') +
      clip('videos/ai/happy-welcome-offer.mp4', 'Welcome Offer', 'AI · Meta 9:16')),
    section('streamer', '03 / Creator footage', 'Streamer ads', [
        'Big wins from the Svea streamers, cut into Meta ads with Happy’s band, logo and shapes around the stream.'],
      ['UGC', 'Meta 9:16'],
      clip('videos/happy-svea-duck-hunters-2.mp4', 'Duck Hunters 2', 'Happy × Svea')),
    section('launches', '04 / Launches', 'Game launches', [
        'Colourful 3D shapes, the game characters in focus and an arcade-like rhythm in the edit.'],
      ['Meta 9:16'],
      clip('videos/HSE-MKTG-944-991-1097-HC - Pirots 4 Inferno - Flex.mp4', 'Pirots 4 Inferno', 'Meta 9:16') +
      clip('videos/HC-Meta-Raptor 2 2.mp4', 'Raptor 2', 'Meta 9:16')),
    section('display', '05 / Display', 'Display ads', ['Animated acquisition banners for every size.'],
      ['980×240'],
      clip('videos/HSE-ACQ-CASINO-BONUS-980x240-Swedish.mp4', 'Casino bonus', '980×240', 'is-wide-banner'),
      media_cls='is-display'),
  ],
  [('top', 'Most reached'), ('retro', 'Retro gaming'), ('streamer', 'Streamer ads'), ('launches', 'Launches'), ('display', 'Display')])

# ── FLAX ──
page('flax.html', 'Flax Casino', 'A dry, Swedish creative system for Flax Casino.',
  'Flax Casino',
  'Very Swedish, and dry. I mapped what every competitor says in Meta’s Ad Library and found that nobody owned understatement, so Flax ads now tell a small story and never shout. Same game as Happy, completely different voice.',
  [('262 000', 'accounts reached by my most-seen Flax ad'), ('472 000', 'combined reach of my two most-seen Flax ads'), ('9', 'competitors mapped in the Ad Library')],
  [
    section('top', '01 / Most reached', 'Most-seen ads', ['Flax’s two most-seen ads since I started: a static and a game-launch video.', AL],
      ['Meta 9:16', 'Static', 'Ad Library'],
      static('flax-blitzmanad', 'Blitzmånad, Fire and Roses', 'Blitz month · Fire and Roses', '262 167') +
      clip('videos/flax-pirots4-final-world.mp4', 'Pirots 4 · Final World', 'Video 9:16', reach='209 891')),
    section('system', '02 / Brand concept', 'Understatement', [
        'Small, real situations where the reaction is smaller than the luck: “The birds have moved. Far south.” No exclamation marks, no promises, just a clover where the luck happened.'],
      ['Meta', 'TikTok &amp; Snapchat', 'Brand strategy'],
      clip('videos/flax-pirots5-kikare.mp4', 'Pirots 5 · Binoculars', 'Game launch · 9:16') +
      clip('videos/flax-pirots5-max.mp4', 'Pirots 5 · The treasure hunt', 'Game launch · 9:16') +
      clip('videos/FSE-DonnyandDanny-140126.mp4', 'Donny &amp; Danny', 'Meta 9:16') +
      clip('videos/FSE-MKTG-1057-GG-Phoenix.mp4', 'Phoenix', 'Meta 9:16')),
    section('display', '03 / Display', 'Display ads', ['Animated acquisition banners.'], ['300×600'],
      clip('videos/FSE-ACQ-CASINO-BONUS-300x600-Swedish_V1.mp4', 'Casino bonus', '300×600', 'is-12'),
      media_cls='is-display'),
  ],
  [('top', 'Most reached'), ('system', 'Understatement'), ('display', 'Display')])

# ── VERA&JOHN ──
page('verajohn.html', 'Vera&amp;John', 'Warm, local creative and display for Vera&John.',
  'Vera&amp;John',
  'Close and personal. Vera and John talk like friends giving you a tip, so the tone is warmer, calmer and more local than the other brands.',
  [('484 000', 'accounts reached by my most-seen Vera&amp;John ad')],
  [
    section('top', '01 / Most reached', 'Most-seen ad', ['Vera&amp;John’s most-seen ad since I started.', AL],
      ['Meta 9:16', 'Static', 'Ad Library'],
      static('vj-archdragon-king', 'Månadens studio, Archdragon King', 'Studio of the month · Archdragon King', '484 453')),
    section('video', '02 / Video', 'Big wins &amp; campaigns', [
        'Vera&amp;John’s big wins get the counting-up treatment: the amount rolls up like a slot before it lands. Plus monthly studio campaigns.'],
      ['Meta 9:16', 'Big wins'],
      clip('videos/vj-piggy-riches-bigwin.mp4', 'Piggy Riches · Big win', 'Meta 9:16') +
      clip('videos/VJ - Flex - GamesGlobal_1.mp4', 'Games Global', 'Meta 9:16')),
    section('streamer', '03 / Creator footage', 'Streamer ads', [
        'Svea streamer footage cut into a Vera&amp;John ad for GameLounge, with captions pulled from what he says and Vera&amp;John’s soft blue frame.'],
      ['UGC', 'Meta 9:16'],
      clip('videos/vj-gamelounge-streamer.mp4', 'GameLounge', 'Vera&amp;John × Svea')),
    section('display', '04 / Display', 'Display ads', [
        'One design per campaign, adapted from tall skyscrapers to wide billboards.'],
      ['300×600', '640×360', '980×240'],
      clip('videos/VJ-SWE-AWA-BRAND-WO-26-300x600-Swedish.mp4', 'Welcome offer', '300×600', 'is-12') +
      '          <div class="lg-display-col">\n' +
      clip('videos/VJ-SWE-AWA-BRAND-WO-26-980x240-Swedish.mp4', 'Welcome offer', '980×240', 'is-wide-banner') +
      clip('videos/VJ-SWE-AWA-BRAND-WO-26-640x360-Swedish.mp4', 'Welcome offer', '640×360', 'is-169') +
      '          </div>\n',
      media_cls='is-display'),
  ],
  [('top', 'Most reached'), ('video', 'Big wins'), ('streamer', 'Streamer ads'), ('display', 'Display')])

# ── AI & TOOLS ──
tools = [
  ('Creative Studio', 'Templates and an editor for Meta creative across all four brands. Replaced Figma for our Meta ads.', '~6 700 Meta images and videos'),
  ('Thumbnail Studio', 'Builds game thumbnails for every brand: fetches the assets, picks the motif, makes every size and names the files.', '6 000+ thumbnails'),
  ('Programmatic Studio', 'Renders transparent game videos in four banner formats without After Effects, and checks every file automatically before it goes to Bannerflow.', 'Six games in one day'),
  ('Streamer panel', 'An After Effects panel: cut a stream once in 16:9 and it builds the 9:16 split and endcard for every clip.', 'A new streamer week in minutes'),
  ('CRM Studio', 'CRM banners and tournament images built from each game’s own assets.', 'Tournaments without Figma'),
  ('Campaign Builder', 'Meta creative, campaigns and results in one sheet, shared with the performance team.', 'Creative and numbers in one place'),
]
tools_html = '        <ul class="lg-tools">\n' + ''.join(
  f'          <li><b>{a}</b><span>{b}</span><em>{c}</em></li>\n' for a, b, c in tools) + '        </ul>\n'
steps = '''        <ol class="lg-steps">
          <li><div><strong>Concept</strong>I start with the hook and the story. What should people feel in the first second, and what makes them watch until the end?</div></li>
          <li><div><strong>Generate</strong>I build node-based workflows in Figma Weave where image and video models are connected in one graph, and reuse the graph for the next campaign.</div></li>
          <li><div><strong>Craft</strong>I composite, animate, add type and edit everything by hand in After Effects, with the brand’s own elements, legal text and safe zones.</div></li>
          <li><div><strong>Scale</strong>I design the original, then Claude scales it. One agent per brand builds from my templates, and a reviewer agent checks every card against my originals before I see anything.</div></li>
        </ol>
'''
ai_sec = ('    <section class="lg-section lg-ai" id="how">\n      <div class="lg-panel">\n        <header class="lg-head">\n'
  '          <span class="lg-kicker">01 / How I work</span>\n          <h2>How I work with AI</h2>\n'
  '          <p>I use AI every day, but the idea always comes first. It helps me create things I could never film, like full stadiums, crowds and 3D characters, and it takes care of the repetitive parts of production so I have more time for the creative work.</p>\n'
  '          <ul class="lg-tags"><li>Figma Weave</li><li>Claude Code</li><li>After Effects</li><li>Figma</li></ul>\n'
  '        </header>\n        <div class="lg-media">\n' +
  clip('videos/ai/lucky-lyckokampen.mp4', 'Lyckokampen', 'Lucky · Meta &amp; TikTok 9:16', reach='64 665') +
  clip('videos/ai/happy-welcome-offer.mp4', 'Welcome Offer', 'Happy · Meta 9:16') +
  clip('videos/ai/happy-games.mp4', 'Happy Games', 'Happy · Meta 9:16') +
  clip('videos/ai/lucky-pl-vinnarspel.mp4', 'Premier League Vinnarspel', 'Lucky Sport · 9:16') +
  '        </div>\n' + steps + '      </div>\n    </section>\n\n')
tools_sec = ('    <section class="lg-section lg-tools-sec" id="tools">\n      <div class="lg-panel">\n        <header class="lg-head">\n'
  '          <span class="lg-kicker">02 / Systems</span>\n          <h2>Tools I built</h2>\n'
  '          <p>Four brands, new games every week and every ad in many formats is too much to do by hand. So I built my own production tools with Claude Code. They handle the repetitive parts, I make the creative calls and review everything that goes out.</p>\n'
  '          <ul class="lg-tags"><li>Claude Code</li><li>Codex</li><li>Python</li><li>Apps Script</li></ul>\n'
  '        </header>\n' + tools_html + '      </div>\n    </section>\n\n')
page('ai-tools.html', 'AI &amp; Tools', 'How Gabija Sura uses AI and the production tools she built with Claude Code.',
  'AI &amp; Tools',
  'Alongside the ads, I build the systems that make them. These are the AI workflows and production tools I’ve made at Lcky Group, and what they’ve delivered since September 2025.',
  [('10 700', 'ads and assets delivered'), ('6 000+', 'game thumbnails, automated'), ('518', 'videos'),
   ('~50%', 'of everything our team delivers'), ('12', 'production tools I built'), ('4.2M+', 'combined reach, my ten most-seen ads')],
  [ai_sec, tools_sec],
  [('how', 'How I work'), ('tools', 'Tools I built')])
