import React from 'react';

export function withBarcodeScanner(WrappedComponent) {
  return class BarCodeScanner extends React.Component {
    constructor(props) {
      super(props);

      this.timer = null;
      this.wrapped = null;
      this.input_string = "";

      this.initListener();
    }

    initListener = () => {
      if (typeof window !== `undefined`)
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp = (e) => {
      const timeoutCallback = () => {
        if (this.input_string.length <= 3) {
          this.input_string = "";
          return;
        }

        this.handleScannerRead(this.input_string);
        this.input_string = "";
      }

      // border cases
      if (e.key === "Enter") timeoutCallback();
      if (this.timer) clearTimeout(this.timer);
      if (e.key.length <= 1) this.input_string += e.key;

      this.timer = setTimeout(timeoutCallback, 100);
    }

    handleScannerRead = (input_string) => {
      if (!this.wrapped || !this.wrapped.handleScannerRead) {
        console.log("implement handleScannerRead method");
        return;
      }

      this.wrapped.handleScannerRead(input_string);
    }

    render = () => {
      return <WrappedComponent {...this.props} ref={e => this.wrapped = e} />;
    }
  }
}
