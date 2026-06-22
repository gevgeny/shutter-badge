# Shutter Badge for Home Assistant

A custom Home Assistant badge to control shutters directly from the dashboard.

![Shutter Badge demo](./demo.png)

## Features

- Customizable label, icon, and color
- Control shutter up/down by toggling associated switch entities
- Supports multiple shutters under a single badge
- Automatically stops after a configurable duration for full open/close

## Installation

1. Open **Dashboard Settings** (three-dot menu, top-right).
2. Select **Resources**.
3. Add the resource:

   ```yaml
   URL: https://cdn.jsdelivr.net/gh/gevgeny/shutter-badge@1.1.0/source/shutter-badge.js
   Type: JavaScript Module
   ```
4. Save and refresh the page.

## Configuration

1. Open your dashboard in Edit Mode.
2. Click the Add Badge **[+]** button.
3. Scroll to the bottom and select **Manual**.
4. Paste the YAML below and customize it.

**Single shutter:**

```yaml
type: custom:shutter-badge
label: Shutter
icon: mdi:window-shutter
color: var(--orange-color)
switch_up: switch.shellyplus2pm_switch_0
switch_down: switch.shellyplus2pm_switch_1
duration: 10
```

**Multiple shutters under one badge:**

```yaml
type: custom:shutter-badge
label: All Shutters
icon: mdi:window-shutter
color: var(--orange-color)
switch_up: switch.shutter1_up, switch.shutter2_up, switch.shutter3_up
switch_down: switch.shutter1_down, switch.shutter2_down, switch.shutter3_down
duration: 10
```

### Configuration Options

| Option        | Type     | Required | Default                | Description                                                         |
| ------------- | -------- | -------- | ---------------------- | ------------------------------------------------------------------- |
| `label`       | `string` | No       | `Shutter`              | Label displayed on the badge.                                       |
| `icon`        | `string` | No       | —                      | Material Design icon (e.g. `mdi:window-shutter`).                  |
| `color`       | `string` | No       | `var(--primary-color)` | Badge color — CSS value or variable.                                |
| `switch_up`   | `string` | Yes      | —                      | Entity ID(s) for the UP direction. Comma-separate for multiple.     |
| `switch_down` | `string` | Yes      | —                      | Entity ID(s) for the DOWN direction. Comma-separate for multiple.   |
| `duration`    | `number` | No       | `10`                   | Seconds to keep the switch on for a full open/close.                |

## License

This project is open-source and available under the [MIT License](LICENSE).
