import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js";
import "./shutter-badge-ring.js";

console.info("%cShutter Badge. v1.0.0", "color: lime; font-weight: bold;");

const styles = css`
  :host {
    --border-width: var(--ha-card-border-width, 1px);
    --badge-size: var(--ha-badge-size, 36px);
    --badge-control-size: calc(var(--badge-size) - 2 * var(--border-width));
  }

  .badge {
    position: relative;
    --ha-ripple-color: var(--badge-color);
    --ha-ripple-hover-opacity: 0.04;
    --ha-ripple-pressed-opacity: 0.12;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: var(--badge-size);
    min-width: var(--badge-size);
    padding: 0 12px;
    box-sizing: border-box;
    width: auto;
    border-radius: var(--ha-badge-border-radius, calc(var(--badge-size) / 2));
    background: var(--ha-card-background, var(--card-background-color, #fff));
    backdrop-filter: var(--ha-card-backdrop-filter, none);
    border-width: var(--border-width);
    box-shadow: var(--ha-card-box-shadow, none);
    border-style: solid;
    border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    transition: padding 0.3s ease-out;

    &.expanded {
      padding-right: 0;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .label {
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: 10px;
    letter-spacing: 0.1px;
    color: var(--secondary-text-color);
  }
  .text {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
  }

  .controls {
    height: 100%;
    display: flex;
    width: 0;
    opacity: 0;
    overflow: hidden;
    transition: width 0.3s ease-out, opacity 0.3s ease-out;

    &.expanded {
      width: calc(2 * var(--badge-control-size));
      opacity: 1;
    }
  }

  .button {
    border: none;
    background: transparent;
    position: relative;
    cursor: pointer;
    width: 50%;
    border-radius: 50%;
    color: var(--primary-text-color);
  }
  .show {
    display: block;
  }
  .hide {
    display: none;
  }
  .active {
    color: var(--badge-color);
  }

  ha-icon {
    color: var(--badge-color);
    margin-right: 8px;
    &.pulse {
      animation: pulsate 2s ease-out;
      animation-iteration-count: infinite;
      opacity: 1;
    }
  }
  custom-ring {
    position: absolute;
    top: 0;
    left: 0;
  }

  @keyframes pulsate {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
`;

function resolveCSSExpression(root, variableName, property = "width") {
  const tempElement = document.createElement("div");
  tempElement.style.setProperty(property, `var(${variableName})`);
  root.appendChild(tempElement);

  const resolvedValue = getComputedStyle(tempElement)
    .getPropertyValue(property)
    .trim();

  root.removeChild(tempElement);

  return resolvedValue;
}

class ShutterBadge extends LitElement {
  static properties = {
    hass: {},
    config: {},
    _state: { state: true },
    _isExpanded: { state: true },
    _isUpPressed: { state: true },
    _isDownPressed: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this._isUpPressed = false;
    this._isDownPressed = false;
    this._isExpanded = false;
  }

  get _isActive() {
    return this._isExpanded || this._isDownPressed || this._isUpPressed;
  }

  get _isSwitchUpOn() {
    return this._isUpPressed;
  }
  set _isSwitchUpOn(value) {
    this._isUpPressed = value;
    this.turnSwitch(this.config.switch_up, value);
  }

  get _isSwitchDownOn() {
    return this._isDownPressed;
  }
  set _isSwitchDownOn(value) {
    this._isDownPressed = value;
    this.turnSwitch(this.config.switch_down, value);
  }

  render() {
    const switchUpState = this.hass?.states?.[this.config.switch_up];
    const switchDownState = this.hass?.states?.[this.config.switch_down];
    const lastChangedUp = new Date(switchUpState?.last_changed);
    const lastChangedDown = new Date(switchDownState?.last_changed);
    const isOn =
      switchUpState?.state === "on" || switchDownState?.state === "on";
    const controlSize = parseInt(
      resolveCSSExpression(this.shadowRoot, "--badge-control-size"),
      10
    );

    this.style.setProperty("--badge-color", this.config.color);

    return html`
      <div
        class="badge ${this._isActive ? "expanded" : ""}"
        label="Shutter"
        @mouseenter="${this.handleMouseEnter}"
        @mouseleave="${this.handleMouseLeave}"
      >
        ${this.config.icon
          ? html`<ha-icon
              icon="${this.config.icon}"
              class="${isOn ? "pulse" : ""}"
            />`
          : ""}
        <div class="info">
          <div class="label">${this.config.label}</div>
          <div class="text">
            ${lastChangedUp > lastChangedDown ? "Up" : "Down"}
          </div>
        </div>
        <div class="controls ${this._isActive ? "expanded" : ""}">
          <button class="button button-left" @click="${this.up}">
            <ha-ripple></ha-ripple>
            <span class="${this._isUpPressed ? "active" : ""}">▲</span>
            <shutter-badge-ring
              class="${this._isUpPressed ? "show" : "hide"}"
              size="${controlSize}"
              color="${this.config.color}"
              duration="${this.config.duration}"
            />
          </button>
          <button class="button button-right" @click="${this.down}">
            <ha-ripple></ha-ripple>
            <span class="${this._isDownPressed ? "active" : ""}">▼</span>
            <shutter-badge-ring
              class="${this._isDownPressed ? "show" : "hide"}"
              size="${controlSize}"
              color="${this.config.color}"
              duration="${this.config.duration}"
            />
          </button>
        </div>
      </div>
    `;
  }

  delayClearToggles() {
    this._timerId = setTimeout(() => {
      this._isSwitchDownOn = false;
      this._isSwitchUpOn = false;
    }, this.config.duration * 1000);
  }

  up() {
    console.log("up", this.hass);

    this._isSwitchDownOn = false;
    clearTimeout(this._timerId);
    if (this._isSwitchUpOn) {
      this._isSwitchUpOn = false;
    } else {
      this._isSwitchUpOn = true;
      this.delayClearToggles();
    }
  }

  down() {
    console.log("down", this.hass);

    this._isSwitchUpOn = false;
    clearTimeout(this._timerId);
    if (this._isSwitchDownOn) {
      this._isSwitchDownOn = false;
    } else {
      this._isSwitchDownOn = true;
      this.delayClearToggles();
    }
  }

  handleMouseLeave() {
    this._isExpanded = false;
  }

  handleMouseEnter() {
    this._isExpanded = true;
  }

  updated(changedProperties) {
    const entityId = this.config.entity;
    const newState = this.hass?.states[entityId]?.state || "Unknown";

    if (this._state !== newState) {
      this._state = newState;
    }
  }

  setConfig(config) {
    if (!config.switch_up) {
      throw new Error("switch_up is required in configuration");
    }
    if (!config.switch_down) {
      throw new Error("switch_down is required in configuration");
    }
    this.config = {
      ...config,
      label: config.label ?? "Shutter",
      duration: config.duration ?? 10,
      color: config.color ?? "var(--primary-color)",
    };
  }

  turnSwitch(entityId, value) {
    const domain = entityId.split(".")[0];

    this.hass.callService(domain, value ? "turn_on" : "turn_off", {
      entity_id: entityId,
    });
  }
}

customElements.define("shutter-badge", ShutterBadge);
