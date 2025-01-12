import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

// https://stackoverflow.com/a/17652638
class ShutterBadgeRing extends LitElement {
    static get properties() {
        return {
          size: { type: String },
          color: { type: String },
          duration: { type: Number },
        };
    }

    static styles = css`
      :host {
        --thickness: 1px;
      }
      
      .wrapper {
        width: var(--size); 
        height: var(--size);
        position: absolute; 
        top: 0;
        left: 0;
        clip: rect(0px, var(--size), var(--size), calc(var(--size) / 2)); 
      }
      
      .circle {
        width: calc(var(--size) - 2 * var(--thickness));
        height: calc(var(--size) - 2 * var(--thickness));
        border: var(--thickness) solid var(--color);
        border-radius: calc(var(--size) / 2);
        position: absolute;
        clip: rect(0px, calc(var(--size) / 2), var(--size), 0px);
      }
      
      div[data-anim~=base] {
        animation-iteration-count: 1;  
        animation-fill-mode: forwards; 
        animation-timing-function: linear; 
      }
      
      .wrapper[data-anim~=wrapper] {
        animation-duration: 0.01s; 
        animation-delay: calc(var(--duration) / 2);
        animation-name: close-wrapper; 
      }
      
      .circle[data-anim~=left] {
        animation-duration: var(--duration); 
        animation-name: left-spin;
      }
      
      .circle[data-anim~=right] {
        animation-duration: calc(var(--duration) / 2);
        animation-name: right-spin;
      }
      
      @keyframes right-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(180deg);
        }
      }
      
      @keyframes left-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes close-wrapper {
        to {
          clip: rect(auto, auto, auto, auto);
        }
      }
    `;

    render() {
        this.style.setProperty('--color', this.color);
        this.style.setProperty('--size', this.size + 'px');
        this.style.setProperty('--duration', this.duration + 's');

        return html`
            <div class="wrapper" data-anim="base wrapper">
                <div class="circle" data-anim="base left"></div>
                <div class="circle" data-anim="base right"></div>
            </div>
        `;
    }
}

customElements.define("shutter-badge-ring1", ShutterBadgeRing);
