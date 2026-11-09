// Readings, Otherwise (the index), in Persian (lang.js). The page's frame comes from the site's
// layout, so its title, crumb and keys guide are marked here rather than in the page.
(function () {
  const mark = (sel, key) => { const el = document.querySelector(sel); if (el) el.dataset.t = key; };
  mark(".fp-title", "h1");
  mark(".fp-crumb__path", "crumb-path");
  mark('.fp-crumb__up', "crumb-up");
  mark(".fp-crumb__help", "keys");
  mark("#fp-help-t", "help-title");
  mark(".fp-help__note", "help-note");
  const sib = document.querySelector('.fp-crumb__sib[rel="prev"]'); if (sib) sib.dataset.t = "crumb-prev";
  const nx = document.querySelector('.fp-crumb__sib[rel="next"]'); if (nx) nx.dataset.t = "crumb-next";

  const links = (see, more, code, extra) =>
    `<p class="ro-links"><a href="${see}">ببینید</a> ${more} <a href="${code}">کد</a>${extra || ""}</p>`;

  RO.add({
    t: {
      "@title": "خوانش‌های دیگرگونه · حامد یعقوبیان",
      "h1": "خوانش‌های دیگرگونه",
      "crumb-path": '<a href="/">حامد یعقوبیان</a><span class="fp-crumb__sep">/</span><a href="/readings-otherwise/" aria-current="page"><span class="fp-crumb__n">06</span> خوانش‌ها</a>',
      "crumb-up": '<span class="fp-k">esc</span>بالا',
      "crumb-prev": '<span class="fp-k">[</span>ابزارها',
      "crumb-next": '<span class="fp-k">]</span>شعرها',
      "intro": "متن‌های کهن، خوانده با ماشین‌های نو. نه درست خوانش دقیق، نه درست خوانش از دور. چیزی از پهلو. هر اثر کتابی را از هم باز می‌کند و آنچه را معمولاً دور ریخته می‌شود نگه می‌دارد. گمانه‌زن، ناتمام، و بیشتر برای تماشا.",
      "count": "۵ اثر · تازه‌ترین نخست",
      "toolbar-keys": '<span class="fp-k">j</span><span class="fp-k">k</span>گام · <span class="fp-k">enter</span>باز کردن',

      "r5-t": "گیاهان چه می‌دانند",
      "r5-m": '<span class="fp-live" aria-label="تازه‌ترین"></span>شمارهٔ ۵ · <time datetime="2026-11-08">۱۷ آبان ۱۴۰۵</time>',
      "r5-b": `<p class="ro-row__line">گیاهان در هشت کتاب، روشن به اندازهٔ جانی که هر متن به آن‌ها می‌دهد. ۵٬۲۰۲ گیاه، ۶٬۶۲۸ خوانش</p>
      <dl class="fp-spec ro-spec">
        <dt>برداشته</dt><dd>همهٔ واژه‌ها جز گیاهان</dd>
        <dt>مانده</dt><dd>۵٬۲۰۲ گیاه در شش کتاب شمارهٔ ۴، با گلستان و بوستان سعدی</dd>
        <dt>روشنایی</dt><dd>نردبان جان‌ها: یک چیز، زندگی گیاهی، نفس حیوانی، نفس ناطقه، به پیروی از ابن‌سینا و مولوی</dd>
      </dl>
      <p class="ro-note">شش کتابِ <em>جانوران چه می‌دانند</em>، با <em>گلستان</em> و <em>بوستان</em> سعدی در کنارشان، که از آن‌ها همهٔ واژه‌ها جز گیاهان برداشته شده و هر گیاه به اندازهٔ پله‌ای روشن است که متن آن را بر نردبان خود این سنت بالا می‌برد: نفس نباتی و حیوانی و ناطقهٔ ابن‌سینا، و <bdi lang="fa">از جمادی مردم و نامی شدم</bdi>ِ مولوی. بیش از نیمی از گیاهان گیاه نیستند، آدم‌اند: سرو قامت است و گل رخسار. باقی چوب یا گل‌اند، و شعرها از میانهٔ نردبان می‌جهند: در هشت کتاب، تنها دوازده گیاه حسی دارند که با گیاه بودنشان سازگار است. وقتی گیاهی سخن می‌گوید، تقریباً همیشه در دیوان پروین است، که گلش به خار پاسخ می‌دهد؛ <em>شاهنامه</em> یک درخت سخن‌گو دارد، و آن درخت به اسکندر می‌گوید که خواهد مرد.</p>
      ${links("/readings-otherwise/what-the-plants-know/", '<a href="/readings-otherwise/what-the-plants-know/atlas/">اطلس</a>', "https://github.com/hamedyaghoobian/what-the-plants-know")}`,

      "r4-t": "جانوران چه می‌دانند",
      "r4-m": 'شمارهٔ ۴ · <time datetime="2026-11-08">۱۷ آبان ۱۴۰۵</time>',
      "r4-b": `<p class="ro-row__line">جانوران در شش کتاب، روشن به اندازهٔ ذهنی که هر متن به آن‌ها می‌دهد. ۱۲٬۴۱۳ جانور، ۱۷٬۹۸۹ خوانش</p>
      <dl class="fp-spec ro-spec">
        <dt>برداشته</dt><dd>همهٔ واژه‌ها جز جانوران</dd>
        <dt>مانده</dt><dd>۱۲٬۴۱۳ جانور در کلیله و دمنه، منطق‌الطیر، شاهنامه، مثنوی، مرزبان‌نامه و دیوان پروین اعتصامی</dd>
        <dt>روشنایی</dt><dd>اندازهٔ ذهنی که متن به هر یک می‌دهد، به پیروی از <em>Minding Animals</em> واگشال</dd>
      </dl>
      <p class="ro-note">شش کتاب از ادبیات فارسی، <em>کلیله و دمنه</em>، <em>منطق‌الطیر</em> عطار، <em>شاهنامهٔ</em> فردوسی، <em>مثنوی</em> مولوی، <em>مرزبان‌نامهٔ</em> وراوینی و <em>دیوان</em> پروین اعتصامی، که از آن‌ها همهٔ واژه‌ها جز جانوران برداشته شده و هر جانور به اندازهٔ ذهنی روشن است که متن به او می‌دهد، به زبان کتاب <em>Minding Animals</em> استیون واگشال. افسانه‌ها روشن‌اند: شغال‌ها با ذهن آدمی نقشه می‌کشند. حماسه تاریک است: اسب‌هایش شمرده و بخشیده و سوار می‌شوند، و شیرهایش بیشتر مردان‌اند. از اسب‌هایی که ذهنی یافته‌اند، نیمی نام دارند. جانوران مولوی بیشتر آدمیانی در جامهٔ مبدل‌اند، اما سگ‌هایش ذهنی از آنِ خود دارند؛ و پروین، تنها شاعر امروزی این میان، جانورانش را از همه راستین‌تر می‌خواند.</p>
      ${links("/readings-otherwise/what-the-animals-know/", '<a href="/readings-otherwise/what-the-animals-know/atlas/">اطلس</a>', "https://github.com/hamedyaghoobian/what-the-animals-know")}`,

      "r3-t": "آنچه فردوسی راه داد",
      "r3-m": 'شمارهٔ ۳ · <time datetime="2026-11-02">۱۱ آبان ۱۴۰۵</time>',
      "r3-b": `<p class="ro-row__line">واژه‌های عربی در تاریکی. ۶٬۴۰۹ از ۵۶۸٬۴۷۹ واژه، ۴۹٬۶۱۰ بیت، یک وزن</p>
      <dl class="fp-spec ro-spec">
        <dt>برداشته</dt><dd>همهٔ واژه‌های فارسی</dd>
        <dt>مانده</dt><dd>۶٬۴۰۹ واژهٔ عربی، یکی در هر نود</dd>
        <dt>لایه</dt><dd><span class="ro-red" aria-hidden="true"></span>۱۶۶ بخشی که عنوانشان از مرگی نام می‌برد، با سایهٔ سرخ</dd>
      </dl>
      <p class="ro-note">فردوسی <em>شاهنامه</em>، نامهٔ شاهان، را در سال ۱۰۱۰ میلادی به پایان برد: نزدیک به پنجاه هزار بیت از تاریخ ایران، از نخستین شاه تا تازش عرب، که به پاک نگه داشتن پارسی‌اش از عربی نامور است. اینجا همان کتاب است با همهٔ واژه‌های فارسی‌اش برداشته. آنچه مانده ۶٬۴۰۹ واژه‌ای است که او از عربی راه داد، یکی در هر نود، پراکنده در میدانی تاریک: قیصر، عنان، عاج، سلاح، سنان. نزدیک بیایید تا آن‌ها را در بیت‌هایشان بخوانید. لایهٔ دوم ۱۶۶ بخشی را که عنوانشان از مرگی نام می‌برد سرخ سایه می‌زند.</p>
      ${links("/readings-otherwise/what-ferdowsi-let-in/", '<a href="https://ganjoor.net/ferdousi/shahname">شاهنامه را در گنجور بخوانید</a>', "https://github.com/hamedyaghoobian/ferdowsi-shahnameh")}`,

      "r2-t": "آنچه پرندگان وا می‌نهند",
      "r2-m": 'شمارهٔ ۲ · <time datetime="2026-11-01">۱۰ آبان ۱۴۰۵</time>',
      "r2-b": `<p class="ro-row__line">نقطه‌ها در پرواز. ۱۱۲٬۰۵۲ نقطه، ۴٬۶۹۷ بیت، یک وزن</p>
      <dl class="fp-spec ro-spec">
        <dt>برداشته</dt><dd>همهٔ حرف‌ها</dd>
        <dt>مانده</dt><dd>۱۱۲٬۰۵۲ نقطه، در پروازی دسته‌جمعی چون گلهٔ سارها</dd>
        <dt>خط‌ها</dt><dd>نسخ · نستعلیق · انگلیسیِ فیتزجرالد، که تنها ۲٬۸۴۰ نقطه در آن جایی برای نشستن دارند</dd>
        <dt>زر</dt><dd><span class="ro-gold" aria-hidden="true"></span>۱۶۴ نقطه که «سیمرغ» را می‌نویسند</dd>
      </dl>
      <p class="ro-note">در سال ۱۱۷۷ میلادی عطار نیشابوری، که در خراسان دارو و گیاه می‌فروخت، <em>منطق‌الطیر</em> را به پایان برد، شعری صوفیانه که در آن پرندگان جهان به جست‌وجوی شاه خود، سیمرغ، راه می‌افتند و سی پرنده‌ای که از سفر جان به در می‌برند تنها خود را می‌یابند: سی مرغ. اینجا همان شعر است با همهٔ حرف‌هایش برداشته. ۱۱۲٬۰۵۲ نقطه‌ای که مانده، دسته‌جمعی، چون گلهٔ سارها، پرواز می‌کنند. بی‌حرکت بمانید تا به بیت‌ها بازگردند، بر استخوان‌بندی برهنهٔ حرف‌هایی که از آن‌ها برداشته شده‌اند. آن را به نسخ یا نستعلیق بنویسید و همان نقطه‌ها جای دیگری می‌نشینند. در انگلیسیِ فیتزجرالد تنها ۲٬۸۴۰ نقطه جایی برای نشستن دارند. نقطه‌های زرین «سیمرغ» را می‌نویسند.</p>
      ${links("/readings-otherwise/what-the-birds-leave/", '<a href="https://ganjoor.net/attar/manteghotteyr">شعر را در گنجور بخوانید</a>', "https://github.com/hamedyaghoobian/attar-conference-of-birds")}`,

      "r1-t": "آنچه سرمایه وا می‌نهد",
      "r1-m": 'شمارهٔ ۱ · <time datetime="2026-10-28">۶ آبان ۱۴۰۵</time>',
      "r1-b": `<p class="ro-row__line">نشانه‌گذاری بر صفحه. ۱۶۲٬۸۹۰ نشانه، ۱٬۱۶۱٬۲۳۷ توکن</p>
      <dl class="fp-spec ro-spec">
        <dt>برداشته</dt><dd>همهٔ واژه‌ها، در هر سه جلد</dd>
        <dt>مانده</dt><dd>۱۶۲٬۸۹۰ نشانه، نقاشی‌شده چون دریایی تاریک</dd>
        <dt>سرخ</dt><dd><span class="ro-red" aria-hidden="true"></span>ماشین، که نشانه‌ها را یکی‌یکی می‌خواند</dd>
      </dl>
      <p class="ro-note"><em>سرمایهٔ</em> مارکس، هر سه جلد، با همهٔ واژه‌هایش برداشته. نشانه‌گذاری‌ای که مانده چون دریایی تاریک نقاشی شده است. بی‌حرکت بمانید تا واژه‌های گم‌شده بازگردند. گیومه‌ها آنجا که کودکان کارخانه سخن می‌گویند می‌درخشند. این نقاشی با نگاه شما زنده است. ماشینی آن را به سرخی می‌خواند، تنها سرخیِ تصویر.</p>
      ${links("/readings-otherwise/what-capital-leaves/", '<a href="/readings-otherwise/what-capital-leaves/read/">چون یک صفحه بخوانید</a>', "https://github.com/hamedyaghoobian/what-capital-leaves")}`,
    },
  });
})();
