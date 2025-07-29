
// eslint 비활성화로 처리
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  delay:number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if(now - lastCall >= delay){
      lastCall = now;
      callback(...args);
    }
  }
}