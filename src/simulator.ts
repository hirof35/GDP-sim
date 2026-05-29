// 経済指標の型定義
export interface EconomicIndicators {
    consumption: number;
    investment: number;
    governmentSpending: number;
    exports: number;
    imports: number;
  }
  
  // 履歴データの型定義
  export interface HistoryLog {
    year: number;
    gdp: number;
    growthRate: number;
    event: string;
    detail: string;
  }
  
  export class GDPSimulator {
    private year: number = 2026;
    private indicators: EconomicIndicators;
    private history: HistoryLog[] = [];
  
    constructor(initialIndicators: EconomicIndicators) {
      this.indicators = { ...initialIndicators };
      const initialGDP = this.calculateGDP();
      this.history.push({
        year: this.year,
        gdp: initialGDP,
        growthRate: 0,
        event: '初期状態',
        detail: 'シミュレーションが開始されました。'
      });
    }
  
    public calculateGDP(): number {
      const { consumption, investment, governmentSpending, exports, imports } = this.indicators;
      return consumption + investment + governmentSpending + (exports - imports);
    }
  
    public getHistory(): HistoryLog[] {
      return this.history;
    }
  
    public getCurrentStatus() {
      return {
        year: this.year,
        gdp: this.calculateGDP(),
        indicators: { ...this.indicators }
      };
    }
  
    // 1年進める共通処理
    private proceedYear(event: string, detail: string, modifier: (ind: EconomicIndicators) => void): void {
      const previousGDP = this.calculateGDP();
      this.year++;
  
      // 指標の変動を適用
      modifier(this.indicators);
  
      const currentGDP = this.calculateGDP();
      const growthRate = ((currentGDP - previousGDP) / previousGDP) * 100;
  
      this.history.push({
        year: this.year,
        gdp: Math.round(currentGDP * 10) / 10,
        growthRate,
        event,
        detail
      });
    }
  
    // --- 各種経済イベントメソッド ---
    public nextYearNormal(): void {
      this.proceedYear('通常成長', '経済は緩やかに巡航速度で成長しています。', (ind) => {
        ind.consumption *= 1.02;
        ind.investment *= 1.015;
        ind.governmentSpending *= 1.01;
        ind.exports *= 1.02;
        ind.imports *= 1.02;
      });
    }
  
    public applyFiscalStimulus(): void {
      this.proceedYear('財政出動', '政府が50兆円の大型公共投資を実施し、民間消費を刺激しました。', (ind) => {
        ind.governmentSpending += 50;
        ind.consumption += 15;
      });
    }
  
    public raiseInterestRate(): void {
      this.proceedYear('金融引き締め', '中央銀行が利上げを実施。企業の設備投資と個人消費が抑制されました。', (ind) => {
        ind.investment *= 0.90;
        ind.consumption *= 0.97;
      });
    }
  
    public triggerCrisis(): void {
      this.proceedYear('経済危機', '世界的なパンデミック・ショックが発生。需要と貿易が激減しました。', (ind) => {
        ind.consumption *= 0.85;
        ind.investment *= 0.80;
        ind.exports *= 0.75;
      });
    }
  }