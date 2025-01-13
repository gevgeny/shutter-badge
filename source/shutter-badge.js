import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import shutterBadgeSheet from './shutter-badge.css' with { type: "css" };
import './shutter-badge-ring.js';

function resolveCSSExpression(root, variableName, property = 'width') {

    const tempElement = document.createElement('div');
    tempElement.style.setProperty(property, `var(${variableName})`);
    root.appendChild(tempElement);
  
    const resolvedValue = getComputedStyle(tempElement).getPropertyValue(property).trim();
  

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

    static styles = [shutterBadgeSheet];

    constructor() {
        super();
        this._isUpPressed = false;
        this._isDownPressed = false;
        this._isExpanded = false;
    }

    get _isActive () {
        return this._isExpanded || this._isDownPressed || this._isUpPressed;
    }

    get _isSwitchUpOn () { return this._isUpPressed; }
    set _isSwitchUpOn (value) {
        this._isUpPressed = value;
        this.turnSwitch(this.config.switch_up, value);
    }

    get _isSwitchDownOn () { return this._isDownPressed; }
    set _isSwitchDownOn (value) {
        this._isDownPressed = value;
        this.turnSwitch(this.config.switch_down, value);
    }

    render() {
        console.log('render', this._isUpPressed, this._isDownPressed);
        const controlSize = parseInt(resolveCSSExpression(this.shadowRoot, "--badge-control-size"), 10);

        this.style.setProperty('--badge-color', this.config.color);

        return html`
            <div class="badge ${this._isActive ? 'expanded' : ''}"
                label="Shutter"
                @mouseenter="${this.handleMouseEnter}" 
                @mouseleave="${this.handleMouseLeave}"
                @click="${this.click}"
            >
                ${this.config.icon ? html`<ha-icon slot="icon" icon="${this.config.icon}" />` : ''}
                <div class="info">
                    <div class="label">${this.config.label}</div>
                    <div class="text">Idle</div>
                </div>
                <div class="controls ${this._isActive ? 'expanded' : ''}">
                    <button class="button button-left" @click="${this.up}">
                        <ha-ripple></ha-ripple>
                        <span class="${this._isUpPressed ? 'active' : ''}">▲</span>
                        <shutter-badge-ring1 class="${this._isUpPressed ? 'show' : 'hide'}" size="${controlSize}" color="${this.config.color}" duration="${this.config.duration}" />
                    </button>
                    <button class="button button-right" @click="${this.down}">
                        <ha-ripple></ha-ripple>
                        <span class="${this._isDownPressed ? 'active' : ''}">▼</span>
                        <shutter-badge-ring1 class="${this._isDownPressed ? 'show' : 'hide'}" size="${controlSize}" color="${this.config.color}" duration="${this.config.duration}" />
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
        console.log('up', this.hass);

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
        console.log('down', this.hass);

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
            label: config.label ?? 'Shutter',
            duration: config.duration ?? 10,
            color: config.color ?? 'white',
        };
    }

    turnSwitch(entityId, value) {
        const domain = entityId.split('.')[0];

        this.hass.callService(domain, value ? 'turn_on' : 'turn_off', {
            entity_id: entityId,
        });
    }
}

customElements.define("shutter-badge", ShutterBadge);
