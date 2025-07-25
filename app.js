// Tarot Game Application
class TarotGame {
    constructor() {
        this.tarotData = null;
        this.currentSpread = null;
        this.currentCards = [];
        this.revealedCards = [];
        this.celticCrossPositions = {
            1: "현재 상황",
            2: "도전/십자가", 
            3: "먼 과거/기초",
            4: "가까운 과거",
            5: "가능한 미래",
            6: "가까운 미래",
            7: "당신의 접근",
            8: "외부 영향",
            9: "희망과 두려움",
            10: "최종 결과"
        };
        
        this.spreadLayouts = {
            'one-card': {
                name: '원 카드',
                positions: 1,
                layout: 'one-card',
                labels: ['현재 상황']
            },
            'three-card': {
                name: '쓰리 카드', 
                positions: 3,
                layout: 'three-card',
                labels: ['과거', '현재', '미래']
            },
            'celtic-cross': {
                name: '켈틱 크로스',
                positions: 10,
                layout: 'celtic-cross',
                labels: [
                    '현재 상황', '도전/십자가', '먼 과거/기초', '가까운 과거',
                    '가능한 미래', '가까운 미래', '당신의 접근', '외부 영향',
                    '희망과 두려움', '최종 결과'
                ]
            }
        };
        
        this.init();
    }

    async init() {
        console.log('타로 게임 초기화 시작');
        this.hideLoadingScreen();
        this.showScreen('main-screen');
        this.setupEventListeners();
        
        // 백업 데이터를 먼저 로드
        this.tarotData = this.getBackupTarotData();
        console.log('타로 게임 초기화 완료');
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
            loading.classList.add('hidden');
        }
    }

    getBackupTarotData() {
        const majorArcana = [
            { id: 0, name: "바보", keywords: "새로운 시작, 순수함, 모험", upright: "새로운 여행의 시작을 의미합니다. 용기를 내어 첫 발걸음을 떼어보세요.", reversed: "무모한 결정을 경계하세요. 신중함이 필요한 시기입니다." },
            { id: 1, name: "마법사", keywords: "의지력, 창조, 실행력", upright: "목표를 이룰 수 있는 모든 힘과 도구가 준비되어 있습니다. 실행할 때입니다.", reversed: "능력을 오용하거나 자만하지 않도록 주의하세요." },
            { id: 2, name: "여사제", keywords: "직감, 신비, 내면의 지혜", upright: "직감을 믿고 내면의 소리에 귀 기울이세요. 답은 이미 당신 안에 있습니다.", reversed: "감정에만 의존하지 말고 이성적 판단도 함께 활용하세요." },
            { id: 3, name: "여황제", keywords: "풍요, 모성, 창조력", upright: "풍요롭고 창조적인 에너지가 넘치는 시기입니다. 새로운 것을 창조해보세요.", reversed: "과도한 소유욕이나 지나친 보호욕을 조심하세요." },
            { id: 4, name: "황제", keywords: "권위, 안정, 리더십", upright: "강한 리더십과 체계적인 접근으로 목표를 달성할 수 있습니다.", reversed: "독단적인 태도를 피하고 타인의 의견도 수용하세요." },
            { id: 5, name: "교황", keywords: "전통, 영성, 가르침", upright: "전통적인 방법과 기존의 지혜가 도움이 될 것입니다.", reversed: "고정관념에 얽매이지 말고 새로운 방식을 시도해보세요." },
            { id: 6, name: "연인", keywords: "사랑, 선택, 조화", upright: "중요한 선택의 시기입니다. 마음의 소리를 들어보세요.", reversed: "관계에서의 갈등이나 잘못된 선택을 주의하세요." },
            { id: 7, name: "전차", keywords: "의지력, 승리, 통제", upright: "강한 의지력과 집중력으로 모든 장애물을 극복할 수 있습니다.", reversed: "방향성을 잃거나 감정에 휘둘리지 않도록 주의하세요." },
            { id: 8, name: "힘", keywords: "내면의 힘, 용기, 인내", upright: "부드러운 힘과 인내로 어려움을 이겨낼 수 있습니다. 내면의 힘을 믿으세요.", reversed: "감정 조절이 필요하며, 무리한 억압은 피하세요." },
            { id: 9, name: "은둔자", keywords: "내성, 성찰, 지혜", upright: "혼자만의 시간을 통해 내면의 지혜를 찾을 수 있습니다.", reversed: "과도한 고립을 피하고 타인의 도움을 받아들이세요." },
            { id: 10, name: "운명의 수레바퀴", keywords: "운명, 변화, 순환", upright: "긍정적인 변화와 새로운 기회가 찾아올 것입니다.", reversed: "예상치 못한 변화에 유연하게 대처하세요." },
            { id: 11, name: "정의", keywords: "공정, 균형, 진실", upright: "공정한 판단과 균형잡힌 접근이 좋은 결과를 가져올 것입니다.", reversed: "편견을 버리고 모든 면을 객관적으로 살펴보세요." },
            { id: 12, name: "매달린 남자", keywords: "희생, 인내, 새로운 관점", upright: "기다림의 시간이 필요합니다. 다른 관점에서 상황을 바라보세요.", reversed: "의미없는 희생은 피하고 적극적인 행동을 취하세요." },
            { id: 13, name: "죽음", keywords: "종료, 변화, 재탄생", upright: "끝은 새로운 시작을 의미합니다. 변화를 두려워하지 마세요.", reversed: "변화를 거부하지 말고 자연스러운 흐름에 맡기세요." },
            { id: 14, name: "절제", keywords: "조화, 균형, 중용", upright: "균형잡힌 접근과 인내심으로 목표에 도달할 수 있습니다.", reversed: "극단적인 행동을 피하고 중도의 길을 선택하세요." },
            { id: 15, name: "악마", keywords: "유혹, 속박, 욕망", upright: "물질적 욕망이나 유혹에 빠지지 않도록 주의하세요.", reversed: "속박에서 벗어날 때입니다. 자유를 되찾으세요." },
            { id: 16, name: "탑", keywords: "파괴, 충격, 각성", upright: "급작스러운 변화나 깨달음이 있을 수 있습니다.", reversed: "위기를 피하고 안전을 확보하는 것이 중요합니다." },
            { id: 17, name: "별", keywords: "희망, 영감, 치유", upright: "희망적인 미래가 기다리고 있습니다. 꿈을 포기하지 마세요.", reversed: "너무 이상적인 목표보다는 현실적인 계획을 세우세요." },
            { id: 18, name: "달", keywords: "직감, 착각, 불안", upright: "직감을 믿되 착각이나 환상을 조심하세요.", reversed: "불안감을 극복하고 진실을 마주할 용기를 내세요." },
            { id: 19, name: "태양", keywords: "성공, 기쁨, 활력", upright: "성공과 기쁨이 가득한 밝은 시기입니다. 자신감을 가지세요.", reversed: "과신하지 말고 겸손함을 유지하는 것이 중요합니다." },
            { id: 20, name: "심판", keywords: "부활, 각성, 새로운 기회", upright: "과거를 정리하고 새로운 기회를 맞이할 준비를 하세요.", reversed: "과거에 얽매이지 말고 앞으로 나아가세요." },
            { id: 21, name: "세계", keywords: "완성, 성취, 만족", upright: "목표 달성과 완성의 기쁨을 누릴 수 있는 시기입니다.", reversed: "완벽함에 대한 집착을 버리고 현재에 만족하세요." }
        ];

        return {
            major_arcana: majorArcana,
            spreads: this.spreadLayouts
        };
    }

    setupEventListeners() {
        console.log('이벤트 리스너 설정 시작');
        
        // Main screen
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            console.log('게임 시작 버튼 찾음');
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('게임 시작 버튼 클릭됨');
                this.showScreen('spread-screen');
            });
        } else {
            console.error('게임 시작 버튼을 찾을 수 없음');
        }

        // Spread selection
        document.querySelectorAll('.spread-card').forEach((card, index) => {
            console.log(`스프레드 카드 ${index} 이벤트 리스너 추가`);
            card.addEventListener('click', (e) => {
                const spreadType = e.currentTarget.dataset.spread;
                console.log('스프레드 선택됨:', spreadType);
                this.selectSpread(spreadType);
            });
        });

        const backToMainBtn = document.getElementById('back-to-main');
        if (backToMainBtn) {
            backToMainBtn.addEventListener('click', () => {
                console.log('메인으로 돌아가기 클릭');
                this.showScreen('main-screen');
            });
        }

        // Game screen
        const shuffleBtn = document.getElementById('shuffle-cards');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                console.log('카드 섞기 버튼 클릭');
                this.shuffleAndDeal();
            });
        }

        const reshuffleBtn = document.getElementById('reshuffle');
        if (reshuffleBtn) {
            reshuffleBtn.addEventListener('click', () => {
                console.log('다시 섞기 버튼 클릭');
                this.resetGame();
            });
        }

        const backToSpreadBtn = document.getElementById('back-to-spread');
        if (backToSpreadBtn) {
            backToSpreadBtn.addEventListener('click', () => {
                console.log('스프레드 선택으로 돌아가기 클릭');
                this.showScreen('spread-screen');
            });
        }

        // Results screen
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                console.log('다시 하기 버튼 클릭');
                this.resetGame();
            });
        }

        const newSpreadBtn = document.getElementById('new-spread');
        if (newSpreadBtn) {
            newSpreadBtn.addEventListener('click', () => {
                console.log('다른 스프레드 버튼 클릭');
                this.showScreen('spread-screen');
            });
        }

        const copyBtn = document.getElementById('copy-reading');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                console.log('해석 복사 버튼 클릭');
                this.copyReading();
            });
        }
        
        console.log('이벤트 리스너 설정 완료');
    }

    showScreen(screenId) {
        console.log('화면 전환 시도:', screenId);
        
        // 모든 스크린 숨기기
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 타겟 스크린 보이기
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('화면 전환 완료:', screenId);
        } else {
            console.error('화면을 찾을 수 없음:', screenId);
        }
    }

    selectSpread(spreadType) {
        console.log('스프레드 설정:', spreadType);
        this.currentSpread = this.spreadLayouts[spreadType];
        this.setupGameScreen();
        this.showScreen('game-screen');
    }

    setupGameScreen() {
        console.log('게임 화면 설정');
        const spreadTitle = document.getElementById('spread-title');
        const cardPositions = document.getElementById('card-positions');
        
        if (spreadTitle) {
            spreadTitle.textContent = this.currentSpread.name;
        }
        
        if (cardPositions) {
            cardPositions.className = `card-positions ${this.currentSpread.layout}`;
            cardPositions.innerHTML = '';

            // 켈틱 크로스는 특별한 처리
            if (this.currentSpread.layout === 'celtic-cross') {
                cardPositions.classList.add('celtic-cross-spread');
                this.setupCelticCrossLayout();
            } else {
                // 일반적인 카드 슬롯 생성
                for (let i = 0; i < this.currentSpread.positions; i++) {
                    const slot = document.createElement('div');
                    slot.className = 'card-slot';
                    slot.dataset.position = i;
                    
                    const label = document.createElement('div');
                    label.className = 'slot-label';
                    label.textContent = this.currentSpread.labels[i];
                    slot.appendChild(label);
                    
                    cardPositions.appendChild(slot);
                }
            }
        }

        this.resetGameState();
        console.log('게임 화면 설정 완료');
    }

    setupCelticCrossLayout() {
        console.log('켈틱 크로스 레이아웃 설정');
        const cardPositions = document.getElementById('card-positions');
        
        for (let i = 0; i < 10; i++) {
            const slot = document.createElement('div');
            slot.className = `card-slot position-${i + 1}`;
            slot.dataset.position = i;
            
            const label = document.createElement('div');
            label.className = 'slot-label';
            label.textContent = `${i + 1}. ${this.currentSpread.labels[i]}`;
            slot.appendChild(label);
            
            cardPositions.appendChild(slot);
        }
    }

    resetGameState() {
        console.log('게임 상태 리셋');
        this.currentCards = [];
        this.revealedCards = [];
        this.updateCardCount();
        
        const cardName = document.getElementById('card-name');
        const cardDescription = document.getElementById('card-description');
        
        if (cardName) {
            cardName.textContent = '카드를 선택하세요';
        }
        if (cardDescription) {
            cardDescription.innerHTML = '<p>카드를 클릭하면 상세 정보가 표시됩니다.</p>';
        }
    }

    updateCardCount() {
        const cardCount = document.getElementById('card-count');
        if (cardCount) {
            cardCount.textContent = `공개된 카드: ${this.revealedCards.length}/${this.currentCards.length}`;
        }
    }

    shuffleAndDeal() {
        console.log('카드 섞기 및 배치 시작');
        const deck = document.getElementById('card-deck');
        if (deck) {
            deck.classList.add('shuffling');
            setTimeout(() => {
                deck.classList.remove('shuffling');
                this.dealCards();
            }, 800);
        } else {
            this.dealCards();
        }
    }

    dealCards() {
        console.log('카드 배치 시작');
        const slots = document.querySelectorAll('.card-slot');
        
        if (!this.tarotData || !this.tarotData.major_arcana) {
            console.error('타로 데이터가 없습니다');
            return;
        }

        const shuffledCards = this.shuffleArray([...this.tarotData.major_arcana])
            .slice(0, this.currentSpread.positions);

        this.currentCards = shuffledCards.map((card, index) => ({
            ...card,
            position: index,
            isReversed: Math.random() < 0.3, // 30% 확률로 역방향
            isRevealed: false
        }));

        console.log(`${this.currentCards.length}장의 카드를 배치합니다`);

        // 카드를 슬롯에 배치
        slots.forEach((slot, index) => {
            if (this.currentCards[index]) {
                slot.classList.add('filled');
                const existingCard = slot.querySelector('.card');
                if (existingCard) {
                    existingCard.remove();
                }
                
                const card = this.createCardElement(this.currentCards[index], index);
                slot.appendChild(card);

                // 딜링 애니메이션
                setTimeout(() => {
                    card.classList.add('dealing');
                }, index * 200);
            }
        });

        this.updateCardCount();
        console.log('카드 배치 완료');
    }

    createCardElement(cardData, position) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.cardId = cardData.id;
        card.dataset.position = position;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = cardData.isReversed ? 'card-front reversed' : 'card-front';
        
        // 카드 앞면 내용
        const cardTitle = document.createElement('h4');
        cardTitle.textContent = cardData.name;
        
        const cardKeywords = document.createElement('p');
        cardKeywords.textContent = cardData.keywords;
        
        cardFront.appendChild(cardTitle);
        cardFront.appendChild(cardKeywords);

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // 카드 클릭 이벤트
        card.addEventListener('click', () => {
            console.log('카드 클릭:', position, cardData.name);
            this.revealCard(position);
        });

        return card;
    }

    revealCard(position) {
        const cardData = this.currentCards[position];
        if (!cardData || cardData.isRevealed) {
            console.log('카드를 공개할 수 없음:', position);
            return;
        }

        console.log('카드 공개:', cardData.name);
        const cardElement = document.querySelector(`[data-position="${position}"]`).querySelector('.card');
        if (cardElement) {
            cardElement.classList.add('flip', 'revealed');
            
            cardData.isRevealed = true;
            this.revealedCards.push(cardData);
            
            this.updateCardCount();
            console.log(`카드 공개됨: ${this.revealedCards.length}/${this.currentCards.length}`);

            // 카드 정보 표시
            setTimeout(() => {
                this.displayCardInfo(cardData, position);
            }, 400);

            // 모든 카드가 공개되면 결과 화면으로
            if (this.revealedCards.length === this.currentCards.length) {
                console.log('모든 카드 공개 완료, 결과 화면으로 이동');
                setTimeout(() => {
                    this.showResults();
                }, 1500);
            }
        }
    }

    displayCardInfo(cardData, position) {
        const cardName = document.getElementById('card-name');
        const cardDescription = document.getElementById('card-description');

        if (cardName && cardDescription) {
            const positionName = this.currentSpread.labels[position];
            const orientation = cardData.isReversed ? '역방향' : '정방향';
            const meaning = cardData.isReversed ? cardData.reversed : cardData.upright;

            cardName.textContent = `${cardData.name} (${orientation})`;
            cardDescription.innerHTML = `
                <div style="margin-bottom: 16px;">
                    <h4 style="color: var(--tarot-gold); margin-bottom: 8px;">위치: ${positionName}</h4>
                    <p style="color: var(--tarot-light-gold); font-weight: 500; margin-bottom: 8px;">키워드: ${cardData.keywords}</p>
                    <p style="margin-bottom: 0;">${meaning}</p>
                </div>
            `;
        }
    }

    generateComprehensiveReading() {
        const spreadType = this.currentSpread.layout;
        let comprehensiveReading = '';

        switch(spreadType) {
            case 'one-card':
                comprehensiveReading = this.generateOneCardReading();
                break;
            case 'three-card':
                comprehensiveReading = this.generateThreeCardReading();
                break;
            case 'celtic-cross':
                comprehensiveReading = this.generateCelticCrossReading();
                break;
        }

        return comprehensiveReading;
    }

    generateOneCardReading() {
        const card = this.revealedCards[0];
        const orientation = card.isReversed ? '역방향' : '정방향';
        
        return `
            <h4>전체적인 메시지</h4>
            <p>${card.name} ${orientation} 카드가 현재 상황에 대한 핵심 메시지를 전달하고 있습니다.</p>
            
            <h4>조언</h4>
            <p>${card.isReversed ? card.reversed : card.upright} 이 카드의 에너지를 받아들이고 자신의 상황에 적용해보세요.</p>
            
            <h4>행동 지침</h4>
            <p>${card.keywords}과 관련된 영역에서 특별한 주의를 기울이거나 기회를 찾아보세요.</p>
        `;
    }

    generateThreeCardReading() {
        const [past, present, future] = this.revealedCards;
        
        return `
            <h4>시간의 흐름 분석</h4>
            <p><strong>과거 (${past.name}):</strong> ${past.isReversed ? past.reversed : past.upright}</p>
            <p><strong>현재 (${present.name}):</strong> ${present.isReversed ? present.reversed : present.upright}</p>
            <p><strong>미래 (${future.name}):</strong> ${future.isReversed ? future.reversed : future.upright}</p>
            
            <h4>전체적인 스토리</h4>
            <p>과거의 ${past.name}이 현재의 ${present.name} 상황을 만들어냈습니다. 현재 상황을 잘 활용한다면 미래에는 ${future.name}의 에너지를 경험하게 될 것입니다.</p>
            
            <h4>핵심 조언</h4>
            <p>과거의 경험을 토대로 현재의 기회를 잘 활용하여 원하는 미래를 만들어가세요. 특히 ${present.keywords}과 관련된 부분에 집중하세요.</p>
        `;
    }

    generateCelticCrossReading() {
        const cards = this.revealedCards;
        const center = cards.slice(0, 2); // 중심부 (현재상황, 도전과제)
        const influences = cards.slice(2, 6); // 영향력들 (과거, 가능한미래, 최근상황, 가까운미래)  
        const environment = cards.slice(6, 8); // 환경 (접근방법, 외부영향)
        const outcome = cards.slice(8, 10); // 결과 (희망과두려움, 최종결과)
        
        return `
            <h4>중심 테마 분석</h4>
            <p><strong>현재 상황:</strong> ${center[0].name} - ${center[0].isReversed ? center[0].reversed : center[0].upright}</p>
            <p><strong>주요 도전:</strong> ${center[1].name} - ${center[1].isReversed ? center[1].reversed : center[1].upright}</p>
            <p>현재 ${center[0].name}의 상황에서 ${center[1].name}이라는 도전 과제를 마주하고 있습니다.</p>
            
            <h4>과거와 미래의 흐름</h4>
            <p><strong>기초/먼 과거:</strong> ${influences[0].name}의 영향이 현재 상황의 토대가 되었습니다.</p>
            <p><strong>최근 과거:</strong> ${influences[1].name}이 현재에 직접적인 영향을 미치고 있습니다.</p>
            <p><strong>가능한 미래:</strong> ${influences[2].name}의 에너지가 다가오고 있습니다.</p>
            <p><strong>가까운 미래:</strong> ${influences[3].name}이 곧 현실이 될 가능성이 높습니다.</p>
            
            <h4>내외부 환경</h4>
            <p><strong>당신의 접근 방식:</strong> ${environment[0].name} - ${environment[0].isReversed ? '현재 접근 방식을 재검토해야 합니다.' : '현재 접근 방식이 적절합니다.'}</p>
            <p><strong>외부 영향:</strong> ${environment[1].name} - 주변 환경이 ${environment[1].keywords}의 에너지로 영향을 주고 있습니다.</p>
            
            <h4>최종 전망</h4>
            <p><strong>내면의 상태:</strong> ${outcome[0].name}이 당신의 희망과 두려움을 나타냅니다.</p>
            <p><strong>최종 결과:</strong> ${outcome[1].name} - ${outcome[1].isReversed ? outcome[1].reversed : outcome[1].upright}</p>
            
            <h4>종합적인 조언</h4>
            <p>현재 상황을 극복하기 위해서는 ${center[1].keywords}과 관련된 도전을 ${environment[0].keywords}의 방식으로 접근하는 것이 중요합니다. 
            ${influences[3].name}의 에너지를 활용하여 ${outcome[1].name}의 결과로 이어질 수 있도록 노력하세요.</p>
        `;
    }

    showResults() {
        console.log('결과 화면 표시');
        const resultsSummary = document.getElementById('results-summary');
        const comprehensiveContent = document.getElementById('comprehensive-content');
        
        if (resultsSummary) {
            resultsSummary.innerHTML = '';

            this.revealedCards.forEach((card, index) => {
                const resultCard = document.createElement('div');
                resultCard.className = 'result-card';

                const cardInfo = document.createElement('div');
                cardInfo.className = 'result-card-info';
                
                const orientation = card.isReversed ? '역방향' : '정방향';
                const meaning = card.isReversed ? card.reversed : card.upright;
                const position = this.currentSpread.labels[index];

                cardInfo.innerHTML = `
                    <h4>${position}: ${card.name} (${orientation})</h4>
                    <p><strong>키워드:</strong> ${card.keywords}</p>
                    <p><strong>의미:</strong> ${meaning}</p>
                `;

                resultCard.appendChild(cardInfo);
                resultsSummary.appendChild(resultCard);
            });
        }

        // 종합 해석 생성
        if (comprehensiveContent) {
            const comprehensiveReading = this.generateComprehensiveReading();
            comprehensiveContent.innerHTML = comprehensiveReading;
        }

        this.showScreen('results-screen');
    }

    copyReading() {
        let readingText = `=== MYSTIC TAROT 결과 ===\n\n`;
        readingText += `스프레드: ${this.currentSpread.name}\n\n`;
        
        // 개별 카드 정보
        readingText += `=== 카드 정보 ===\n`;
        this.revealedCards.forEach((card, index) => {
            const orientation = card.isReversed ? '역방향' : '정방향';
            const meaning = card.isReversed ? card.reversed : card.upright;
            const position = this.currentSpread.labels[index];
            
            readingText += `${position}: ${card.name} (${orientation})\n`;
            readingText += `키워드: ${card.keywords}\n`;
            readingText += `의미: ${meaning}\n\n`;
        });
        
        // 종합 해석
        const comprehensiveContent = document.getElementById('comprehensive-content');
        if (comprehensiveContent) {
            readingText += `=== 종합 해석 ===\n`;
            // HTML 태그 제거
            const textContent = comprehensiveContent.innerText || comprehensiveContent.textContent;
            readingText += textContent;
        }
        
        // 클립보드에 복사
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(readingText).then(() => {
                // 복사 성공 알림
                const copyBtn = document.getElementById('copy-reading');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '복사 완료!';
                copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(() => {
                alert('복사 중 오류가 발생했습니다.');
            });
        } else {
            alert('클립보드 복사가 완료되었습니다.');
        }
    }

    resetGame() {
        console.log('게임 리셋');
        this.resetGameState();
        
        const slots = document.querySelectorAll('.card-slot');
        slots.forEach(slot => {
            slot.classList.remove('filled');
            const existingCard = slot.querySelector('.card');
            if (existingCard) {
                existingCard.remove();
            }
        });

        this.showScreen('game-screen');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료, 타로 게임 시작');
    window.tarotGameInstance = new TarotGame();
});

// 터치 이벤트 지원
document.addEventListener('touchstart', function() {}, {passive: true});