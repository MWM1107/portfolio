// Homepage: pause/resume the auto-scrolling app catalog carousel.
// (The hero is a standard glass card; its reveal and pointer tilt come
// from the shared code in layout.js, nothing hero-specific lives here.)
(function () {
    var paused = false;
    window.toggleCarousel = function () {
        var track = document.querySelector('.carousel-track');
        var btn = document.getElementById('carousel-pause-btn');
        var icon = document.getElementById('carousel-btn-icon');
        if (!track || !btn || !icon) return;
        paused = !paused;
        track.style.animationPlayState = paused ? 'paused' : 'running';
        btn.setAttribute('aria-label', paused ? 'Resume auto-scroll' : 'Pause auto-scroll');
        icon.innerHTML = paused
            ? '<polygon points="5 3 19 12 5 21 5 3"/>'
            : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    };

    var SNIPPETS = {
        rogueroll: {
            file: 'DiceModel.swift',
            project: 'Rogue Roll',
            code: '<span class="kw-comment">// MARK: - The Die Object</span>\n<span class="kw-keyword">struct</span> <span class="kw-type">Die</span>: <span class="kw-type">Identifiable</span>, <span class="kw-type">Codable</span>, <span class="kw-type">Hashable</span> {\n    <span class="kw-keyword">var</span> id = <span class="kw-type">UUID</span>()\n    <span class="kw-keyword">var</span> sides: <span class="kw-type">Int</span>\n    <span class="kw-keyword">var</span> currentFace: <span class="kw-type">Int</span>\n    <span class="kw-keyword">var</span> suit: <span class="kw-type">DiceSuit</span>\n    <span class="kw-keyword">var</span> rarity: <span class="kw-type">Rarity</span>\n    <span class="kw-keyword">var</span> isLocked: <span class="kw-type">Bool</span> = <span class="kw-keyword">false</span>\n    <span class="kw-keyword">var</span> enchantment: <span class="kw-type">DieEnchantment</span>? = <span class="kw-keyword">nil</span>\n\n    <span class="kw-keyword">static var</span> basic: <span class="kw-type">Die</span> {\n        <span class="kw-type">Die</span>(sides: 6, currentFace: 1,\n            suit: .standard, rarity: .common)\n    }\n}',
            preview: '<div class="sim-dice-row" id="sim-dice">' +
                '<div class="sim-die" style="--die-color:#007aff;--die-glow:rgba(0,122,255,0.6)">4</div>' +
                '<div class="sim-die" style="--die-color:#ff3b30;--die-glow:rgba(142,142,147,0.35)">2</div>' +
                '<div class="sim-die" style="--die-color:#34c759;--die-glow:rgba(52,199,89,0.55)">6</div>' +
                '<div class="sim-die" style="--die-color:#ffd60a;--die-glow:rgba(175,82,222,0.75)">1</div>' +
                '</div>' +
                '<p class="sim-caption" id="sim-dice-label">Score: 13 — Rare Hand</p>' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var suits=[[\'Standard\',\'#f2f2f2\'],[\'Crimson\',\'#ff3b30\'],[\'Cobalt\',\'#007aff\'],[\'Emerald\',\'#34c759\'],[\'Gold\',\'#ffd60a\'],[\'Void\',\'#2c2c2e\']]; ' +
                'var rarities=[[\'Common\',\'rgba(142,142,147,0.35)\'],[\'Uncommon\',\'rgba(52,199,89,0.55)\'],[\'Rare\',\'rgba(0,122,255,0.6)\'],[\'Legendary\',\'rgba(255,149,0,0.7)\'],[\'Glitch\',\'rgba(175,82,222,0.75)\']]; ' +
                'var row=document.getElementById(\'sim-dice\'); row.innerHTML=\'\'; var score=0; ' +
                'for(var i=0;i<4;i++){ var face=Math.floor(Math.random()*6)+1; score+=face; ' +
                'var suit=suits[Math.floor(Math.random()*suits.length)]; var rar=rarities[Math.floor(Math.random()*rarities.length)]; ' +
                'var d=document.createElement(\'div\'); d.className=\'sim-die\'; d.style.setProperty(\'--die-color\',suit[1]); ' +
                'd.style.setProperty(\'--die-glow\',rar[1]); d.style.animationDelay=(i*70)+\'ms\'; d.textContent=face; row.appendChild(d); } ' +
                'var handRarity=rarities[Math.floor(Math.random()*rarities.length)][0]; ' +
                'document.getElementById(\'sim-dice-label\').textContent=\'Score: \'+score+\' — \'+handRarity+\' Hand\'; })();">Roll Hand</button>'
        },
        typekana: {
            file: 'QuizManager.swift',
            project: 'Type Kana',
            code: '<span class="kw-keyword">@Observable\nclass</span> <span class="kw-type">QuizManager</span> {\n    <span class="kw-keyword">var</span> currentKana: <span class="kw-type">Kana</span>?\n    <span class="kw-keyword">var</span> feedbackState: <span class="kw-type">FeedbackState</span> = .idle\n    <span class="kw-keyword">var</span> progress: <span class="kw-type">Double</span> = 0.0\n    <span class="kw-keyword">private(set) var</span> correctAnswers: <span class="kw-type">Int</span> = 0\n    <span class="kw-keyword">private(set) var</span> missedKana: [<span class="kw-type">Kana</span>] = []\n\n    <span class="kw-keyword">func</span> <span class="kw-func">checkAnswer</span>() {\n        <span class="kw-keyword">guard let</span> currentKana = currentKana <span class="kw-keyword">else</span> { <span class="kw-keyword">return</span> }\n        <span class="kw-keyword">let</span> isAnswerCorrect = currentInput.<span class="kw-func">trimmingCharacters</span>(\n            in: .whitespacesAndNewlines\n        ).<span class="kw-func">lowercased</span>() == currentKana.romanji.<span class="kw-func">lowercased</span>()\n\n        <span class="kw-keyword">if</span> isAnswerCorrect {\n            feedbackState = .correct\n            correctAnswers += 1\n            currentKana.correctStreak += 1\n        } <span class="kw-keyword">else</span> {\n            feedbackState = .incorrect\n            currentKana.correctStreak = 0\n        }\n    }\n}',
            preview: '<div id="sim-kana-char-wrap"><span class="sim-kana-char">き</span></div>' +
                '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:10px;">' +
                '<input id="sim-kana-input" type="text" class="sim-kana-input" placeholder="Type romanji..." maxlength="4"></div>' +
                '<p class="sim-caption" id="sim-kana-fb">Type Kana • Quiz Engine</p>' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var pairs=[[\'あ\',\'a\'],[\'い\',\'i\'],[\'う\',\'u\'],[\'え\',\'e\'],[\'お\',\'o\'],[\'か\',\'ka\'],[\'き\',\'ki\'],[\'く\',\'ku\'],[\'け\',\'ke\'],[\'こ\',\'ko\'],[\'さ\',\'sa\'],[\'し\',\'shi\'],[\'す\',\'su\'],[\'た\',\'ta\'],[\'な\',\'na\'],[\'は\',\'ha\'],[\'ま\',\'ma\'],[\'や\',\'ya\'],[\'ら\',\'ra\'],[\'わ\',\'wa\']]; ' +
                'var p=pairs[Math.floor(Math.random()*pairs.length)]; window._kana=p; ' +
                'document.getElementById(\'sim-kana-char-wrap\').innerHTML=\'<span class=&quot;sim-kana-char&quot;>\'+p[0]+\'</span>\'; ' +
                'var inp=document.getElementById(\'sim-kana-input\'); inp.value=\'\'; inp.classList.remove(\'is-correct\',\'is-incorrect\'); ' +
                'var fb=document.getElementById(\'sim-kana-fb\'); fb.textContent=\'Type Kana • Quiz Engine\'; fb.style.color=\'\'; ' +
                '})();">New Card</button> ' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var inp=document.getElementById(\'sim-kana-input\'); var fb=document.getElementById(\'sim-kana-fb\'); if(!window._kana)return; ' +
                'var correct=inp.value.trim().toLowerCase()===window._kana[1]; inp.classList.remove(\'is-correct\',\'is-incorrect\'); ' +
                'inp.classList.add(correct?\'is-correct\':\'is-incorrect\'); ' +
                'fb.textContent=correct?\'✓ Correct! → \'+window._kana[1]:\'✗ Answer: \'+window._kana[1]; ' +
                'fb.style.color=correct?\'#30d158\':\'#ff453a\'; })();">Check</button>'
        },
        stocksim: {
            file: 'LineChartView.swift',
            project: 'Stock Market Sim',
            code: '<span class="kw-keyword">struct</span> <span class="kw-type">LineChartView</span>: <span class="kw-type">View</span> {\n    <span class="kw-keyword">@Environment</span>(<span class="kw-type">GameEnvironment</span>.self) <span class="kw-keyword">var</span> game\n    <span class="kw-keyword">@State private var</span> selection: <span class="kw-type">DateRange</span> = .oneMonth\n\n    <span class="kw-keyword">var</span> chartData: [<span class="kw-type">ChartPoint</span>] {\n        game.portfolioManager.portfolioHistoricalValues\n            .<span class="kw-func">sorted</span> { $0.date < $1.date }\n            .<span class="kw-func">map</span> { <span class="kw-type">ChartPoint</span>(date: $0.date, value: $0.value) }\n    }\n\n    <span class="kw-keyword">var</span> body: <span class="kw-type">some View</span> {\n        <span class="kw-type">FinancialLineChart</span>(\n            data: chartData, color: .blue,\n            currentDate: game.dataManager.gameDate\n        )\n    }\n}',
            preview: '<div class="sim-price" id="sim-stock-price" style="color:#30d158">$204.50</div>' +
                '<div class="sim-change" id="sim-stock-change">▲ 13.6%  •  Net Worth: $13,701</div>' +
                '<div class="sim-chart-wrap"><svg viewBox="0 0 160 48" width="100%" height="48">' +
                '<defs><linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">' +
                '<stop id="simGradStop1" offset="0%" stop-color="#30d158" stop-opacity="0.35"/>' +
                '<stop id="simGradStop2" offset="100%" stop-color="#30d158" stop-opacity="0"/>' +
                '</linearGradient></defs>' +
                '<path id="sim-chart-area" d="M6.0,41.1 L22.4,38.1 L38.9,42.0 L55.3,31.5 L71.8,25.1 L88.2,28.4 L104.7,17.8 L121.1,22.4 L137.6,12.7 L154.0,6.0 L154.0,48 L6.0,48 Z" fill="url(#simGrad)"/>' +
                '<path id="sim-chart-line" class="sim-chart-line" d="M6.0,41.1 L22.4,38.1 L38.9,42.0 L55.3,31.5 L71.8,25.1 L88.2,28.4 L104.7,17.8 L121.1,22.4 L137.6,12.7 L154.0,6.0" stroke="#30d158"/>' +
                '<circle id="sim-chart-dot-pulse" class="sim-chart-dot-pulse" cx="154.0" cy="6.0" r="7" fill="#30d158"/>' +
                '<circle id="sim-chart-dot-ring" cx="154.0" cy="6.0" r="6" fill="#000"/>' +
                '<circle id="sim-chart-dot" cx="154.0" cy="6.0" r="4" fill="#30d158"/>' +
                '</svg></div>' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var w=160,h=48,pad=6,pts=[180],prev=180; ' +
                'for(var i=0;i<9;i++){ var v=Math.max(100,Math.min(260,prev+(Math.random()*24-11))); pts.push(v); prev=v; } ' +
                'var mn=Math.min.apply(null,pts), mx=Math.max.apply(null,pts), rng=Math.max(1,mx-mn); ' +
                'var stepx=(w-2*pad)/(pts.length-1); ' +
                'var coords=pts.map(function(v,i){ return [+(pad+i*stepx).toFixed(1), +(pad+(1-(v-mn)/rng)*(h-2*pad)).toFixed(1)]; }); ' +
                'var up=pts[pts.length-1]>=pts[0]; var color=up?\'#30d158\':\'#ff453a\'; ' +
                'var lineD=\'M\'+coords.map(function(c){ return c[0]+\',\'+c[1]; }).join(\' L\'); ' +
                'var last=coords[coords.length-1], first=coords[0]; ' +
                'var areaD=lineD+\' L\'+last[0]+\',\'+h+\' L\'+first[0]+\',\'+h+\' Z\'; ' +
                'document.getElementById(\'sim-chart-line\').setAttribute(\'d\',lineD); ' +
                'document.getElementById(\'sim-chart-line\').setAttribute(\'stroke\',color); ' +
                'document.getElementById(\'sim-chart-area\').setAttribute(\'d\',areaD); ' +
                'document.getElementById(\'simGradStop1\').setAttribute(\'stop-color\',color); ' +
                'document.getElementById(\'simGradStop2\').setAttribute(\'stop-color\',color); ' +
                '[\'sim-chart-dot\',\'sim-chart-dot-pulse\'].forEach(function(id){ var el=document.getElementById(id); el.setAttribute(\'cx\',last[0]); el.setAttribute(\'cy\',last[1]); el.setAttribute(\'fill\',color); }); ' +
                'document.getElementById(\'sim-chart-dot-ring\').setAttribute(\'cx\',last[0]); document.getElementById(\'sim-chart-dot-ring\').setAttribute(\'cy\',last[1]); ' +
                'var price=pts[pts.length-1], chg=((price-pts[0])/pts[0]*100).toFixed(1); ' +
                'document.getElementById(\'sim-stock-price\').textContent=\'$\'+price.toFixed(2); ' +
                'document.getElementById(\'sim-stock-price\').style.color=color; ' +
                'document.getElementById(\'sim-stock-change\').textContent=(up?\'▲ \':\'▼ \')+Math.abs(chg)+\'%  •  Net Worth: $\'+(Math.floor(price*67)).toLocaleString(); ' +
                '})();">Simulate Market Tick</button>'
        },
        wordly: {
            file: 'WordFilter.swift',
            project: 'Wordly',
            code: '<span class="kw-keyword">struct</span> <span class="kw-type">WordFilter</span> {\n    <span class="kw-keyword">static func</span> <span class="kw-func">filterWords</span>(\n        wordList: [<span class="kw-type">String</span>],\n        correctLetters: [<span class="kw-type">Character</span>?],\n        misplacedLetters: [<span class="kw-type">Character</span>: <span class="kw-type">Set</span><<span class="kw-type">Int</span>>],\n        excludedLetters: <span class="kw-type">Set</span><<span class="kw-type">Character</span>>\n    ) -> [<span class="kw-type">String</span>] {\n        wordList.<span class="kw-func">filter</span> { word <span class="kw-keyword">in</span>\n            <span class="kw-keyword">for</span> (index, letter) <span class="kw-keyword">in</span> correctLetters.<span class="kw-func">enumerated</span>() {\n                <span class="kw-keyword">guard let</span> letter <span class="kw-keyword">else</span> { <span class="kw-keyword">continue</span> }\n                <span class="kw-keyword">let</span> pos = word.<span class="kw-func">index</span>(word.startIndex, offsetBy: index)\n                <span class="kw-keyword">if</span> word[pos] != letter { <span class="kw-keyword">return false</span> }\n            }\n            <span class="kw-keyword">for</span> (letter, badPositions) <span class="kw-keyword">in</span> misplacedLetters {\n                <span class="kw-keyword">guard</span> word.<span class="kw-func">contains</span>(letter) <span class="kw-keyword">else</span> { <span class="kw-keyword">return false</span> }\n                <span class="kw-keyword">for</span> pos <span class="kw-keyword">in</span> badPositions\n                <span class="kw-keyword">where</span> word[word.<span class="kw-func">index</span>(word.startIndex, offsetBy: pos)] == letter {\n                    <span class="kw-keyword">return false</span>\n                }\n            }\n            <span class="kw-keyword">return</span> !excludedLetters.<span class="kw-func">contains</span> { word.<span class="kw-func">contains</span>($0) }\n        }\n    }\n}',
            preview: '<div class="sim-caption" style="margin-top:0;">Wordle Solver • Constraint Engine</div>' +
                '<div class="sim-wordly-grid" id="sim-wordly-grid">' +
                '<div class="sim-wordly-tile" style="background:#30d158;animation-delay:0ms">C</div>' +
                '<div class="sim-wordly-tile" style="background:#ffd60a;animation-delay:80ms">R</div>' +
                '<div class="sim-wordly-tile" style="background:#30d158;animation-delay:160ms">A</div>' +
                '<div class="sim-wordly-tile" style="background:#ff453a;animation-delay:240ms">N</div>' +
                '<div class="sim-wordly-tile" style="background:#30d158;animation-delay:320ms">E</div>' +
                '</div>' +
                '<p class="sim-caption" style="font-weight:600;color:var(--pg-text);" id="sim-wordly-result">Best guess: CRANE</p>' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var words=[\'CRANE\',\'SLATE\',\'TRACE\',\'STARE\',\'SNARE\',\'FLARE\',\'PLACE\',\'GRACE\']; var colors=[\'#ff453a\',\'#ffd60a\',\'#30d158\']; ' +
                'var g=document.getElementById(\'sim-wordly-grid\'); g.innerHTML=\'\'; var w=words[Math.floor(Math.random()*words.length)]; ' +
                'for(var i=0;i<5;i++){ var c=document.createElement(\'div\'); c.className=\'sim-wordly-tile\'; ' +
                'c.style.background=colors[Math.floor(Math.random()*3)]; c.style.animationDelay=(i*80)+\'ms\'; c.textContent=w[i]; g.appendChild(c); } ' +
                'document.getElementById(\'sim-wordly-result\').textContent=\'Best guess: \'+words[Math.floor(Math.random()*words.length)]; ' +
                '})();">Run Filter Pass</button>'
        },
        kodou: {
            file: 'PathBoard.swift',
            project: 'Kodou',
            code: '<span class="kw-keyword">struct</span> <span class="kw-type">PathTile</span>: <span class="kw-type">Identifiable</span>, <span class="kw-type">Equatable</span> {\n    <span class="kw-keyword">let</span> id = <span class="kw-type">UUID</span>()\n    <span class="kw-keyword">var</span> value: <span class="kw-type">Int</span>\n    <span class="kw-keyword">var</span> kind: <span class="kw-type">PathTileKind</span> = .number\n\n    <span class="kw-keyword">var</span> displayText: <span class="kw-type">String</span> {\n        <span class="kw-keyword">guard</span> value >= 1024 <span class="kw-keyword">else</span> { <span class="kw-keyword">return</span> <span class="kw-string">"\\(value)"</span> }\n        <span class="kw-keyword">return</span> <span class="kw-string">"2"</span> + <span class="kw-type">PathTile</span>.<span class="kw-func">superscript</span>(\n            value.trailingZeroBitCount\n        )\n    }\n}',
            preview: '<div class="sim-kodou-wrap">' +
                '<svg class="sim-kodou-lines" id="sim-kodou-lines" viewBox="0 0 172 172"><path pathLength="1" d="M108,20 L108,64 L108,108 L64,108" style="filter:drop-shadow(0 0 3px rgba(255,214,10,0.9))"/></svg>' +
                '<div class="sim-kodou-grid" id="sim-kodou-grid">' +
                '<div class="sim-kodou-tile" style="animation-delay:0ms">4</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:25ms">8</div>' +
                '<div class="sim-kodou-tile is-chained" style="animation-delay:50ms">2</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:75ms">2</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:100ms">4</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:125ms">2</div>' +
                '<div class="sim-kodou-tile is-chained" style="animation-delay:150ms">4</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:175ms">8</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:200ms">2</div>' +
                '<div class="sim-kodou-tile is-chained" style="animation-delay:225ms">16</div>' +
                '<div class="sim-kodou-tile is-chained" style="animation-delay:250ms">8</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:275ms">4</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:300ms">8</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:325ms">2</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:350ms">4</div>' +
                '<div class="sim-kodou-tile" style="animation-delay:375ms">8</div>' +
                '</div></div>' +
                '<p class="sim-caption" id="sim-kodou-label">Chain: 2-4-8-16 (Ascending) • Score: 480pts</p>' +
                '<button class="btn btn-outline sim-action-btn" onclick="(function(){ ' +
                'var g=document.getElementById(\'sim-kodou-grid\'); g.innerHTML=\'\'; var cellSize=40, gap=4; ' +
                'var dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]; ' +
                'function buildChain(len){ ' +
                'for(var attempt=0;attempt<40;attempt++){ ' +
                'var r=Math.floor(Math.random()*4), c=Math.floor(Math.random()*4); var chain=[[r,c]]; var ok=true; ' +
                'for(var step=1;step<len;step++){ var cur=chain[chain.length-1]; var opts=[]; ' +
                'for(var d=0;d<8;d++){ var nr=cur[0]+dirs[d][0], nc=cur[1]+dirs[d][1]; var used=false; ' +
                'for(var k=0;k<chain.length;k++){ if(chain[k][0]===nr&&chain[k][1]===nc){ used=true; break; } } ' +
                'if(nr>=0&&nr<4&&nc>=0&&nc<4&&!used) opts.push([nr,nc]); } ' +
                'if(!opts.length){ ok=false; break; } chain.push(opts[Math.floor(Math.random()*opts.length)]); } ' +
                'if(ok) return chain; } return [[0,0],[0,1],[0,2]]; } ' +
                'var len=Math.floor(Math.random()*2)+3; var chain=buildChain(len); var isSequential=Math.random()<0.5; var chainVals; ' +
                'if(isSequential){ var seqBase=[2,4][Math.floor(Math.random()*2)]; chainVals=chain.map(function(p,i){ return seqBase*Math.pow(2,i); }); } ' +
                'else { var same=[2,4,8,16][Math.floor(Math.random()*4)]; chainVals=chain.map(function(){ return same; }); } ' +
                'var chainSet={}, chainValByIdx={}; ' +
                'chain.forEach(function(p,i){ var idx=p[0]*4+p[1]; chainSet[idx]=true; chainValByIdx[idx]=chainVals[i]; }); ' +
                'for(var i=0;i<16;i++){ var v=chainSet[i]?chainValByIdx[i]:[2,4,8,16][Math.floor(Math.random()*4)]; ' +
                'var d=document.createElement(\'div\'); d.className=\'sim-kodou-tile\'+(chainSet[i]?\' is-chained\':\'\'); ' +
                'd.style.animationDelay=(i*25)+\'ms\'; d.textContent=v; g.appendChild(d); } ' +
                'var lines=document.getElementById(\'sim-kodou-lines\'); var path=\'\'; ' +
                'chain.forEach(function(p,k){ var x=p[1]*(cellSize+gap)+cellSize/2, y=p[0]*(cellSize+gap)+cellSize/2; path+=(k===0?\'M\':\'L\')+x+\',\'+y+\' \'; }); ' +
                'var glow=isSequential?\'rgba(255,214,10,0.9)\':\'rgba(191,90,242,0.9)\'; ' +
                'lines.innerHTML=\'<path pathLength=&quot;1&quot; d=&quot;\'+path.trim()+\'&quot; style=&quot;filter:drop-shadow(0 0 3px \'+glow+\')&quot;/>\'; ' +
                'var sum=chainVals.reduce(function(a,b){return a+b;},0); var mult=isSequential?chainVals.length:1; ' +
                'var score=sum*chainVals.length*mult; ' +
                'document.getElementById(\'sim-kodou-label\').textContent=\'Chain: \'+chainVals.join(\'-\')+(isSequential?\' (Ascending)\':\'\')+\' • Score: \'+score+\'pts\'; ' +
                '})();">Trace Path</button>'
        }
    };

    window.switchPlaygroundTab = function (key) {
        var data = SNIPPETS[key];
        if (!data) return;

        document.querySelectorAll('.playground-tab').forEach(function (t) {
            t.classList.toggle('is-active', t.getAttribute('data-tab') === key);
        });

        var titleEl = document.getElementById('playground-file-name');
        var codeEl = document.getElementById('playground-code-content');
        var canvasEl = document.getElementById('playground-canvas-content');

        if (titleEl) titleEl.textContent = data.file;
        var projectEl = document.getElementById('playground-project-name');
        if (projectEl) projectEl.textContent = data.project || '';
        if (codeEl) codeEl.innerHTML = data.code;
        if (canvasEl) canvasEl.innerHTML = data.preview;
    };
})();
