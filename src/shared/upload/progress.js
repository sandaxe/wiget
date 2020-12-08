export class Progress {
  constructor(updateStatus = (data) => {}) {
    this.progressBar = { value: 0 };
    this.intervalId = undefined;
    this.updateStatus = updateStatus;
    this.setProgress = this.setProgress.bind(this);
  }

  setProgress(percentage) {
    if(this.progressBar.value < percentage && percentage <= 100) {
      this.progressBar.value = percentage;
      this.updateStatus({ uploaded: percentage, message: `${percentage}% Done` });
    }
  }

  setMessage(msg, isError = false) {
    this.updateStatus({ status: isError ? "error" : "", message: msg });
  }

  asyncProgress(start = 0, end = 95) {
    if(this.progressBar.value <= start && start <= 100) {
      this.intervalId && clearInterval(this.intervalId);
      let frame = () => {
        if (this.progressBar && this.progressBar.value >= end) {
          this.stopProgress();
        } else {
          start++;
          this.setProgress(start);
        }
      };
      this.stopProgress();
      this.intervalId = setInterval(frame, 1000);
    }
  }

  stopProgress(msg, isError = false) {
    if(this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    if(msg) {
      this.setMessage(msg, isError);
    }
  }
}
