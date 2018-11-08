export default class OpsHelpers {
  static generateRange(
    range: number,
    arr: boolean = true,
    startingVal: any = 0,
    startFromZero: boolean = true
  ): number[] | {} {
    if (arr) {
      return [...new Array(range)].map((_, index) => index);
    } else {
      return [...new Array(range)].map((_, index) => ({
        [startFromZero ? index : index + 1]: startingVal
      }));
    }
  }
}
