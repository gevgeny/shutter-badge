# Shutter Badge for Home Assistant

A custom Home Assistant badge to control shutter directly from the dashboard.

![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](./demo.png)


## Installation

To use this custom badge, you need to load the JavaScript file into your Home Assistant instance:

1. Open the **Dashboard Settings** (three-dot menu in the top-right corner of your dashboard).
2. Select **Resources**.
3. Add the following resource:

   ```yaml
   URL: https://cdn.jsdelivr.net/gh/gevgeny/shutter-badge/source/shutter-badge.js
   Type: JavaScript Module
   ```
4. Save and refresh the page.

---

## Configuration

Here’s an example YAML configuration to add the `shutter-badge` to your dashboard:

```yaml
- type: custom:shutter-badge
  label: Shutter               
  icon: mdi:window-shutter     
  color: var(--orange-color)   
  switch_up: switch.shellyplus2pm_2cbcaa388f54_switch_0   
  switch_down: switch.shellyplus2pm_2cbcaa388f54_switch_1 
  duration: 10                 
```

### Configuration Options

| Option        | Type     | Required | Default                | Description                                                |
| ------------- | -------- | -------- | ---------------------- | ---------------------------------------------------------- |
| `label`       | `string` | No       | `Shutter`              | Label to display on the badge.                             |
| `icon`        | `string` | No       | `mdi:window-shutter`   | Material Design icon for the badge.                        |
| `color`       | `string` | No       | `var(--primary-color)` | Badge color (CSS color or variable).                       |
| `switch_up`   | `string` | Yes      | -                      | Entity ID of the switch controlling the UP direction.      |
| `switch_down` | `string` | Yes      | -                      | Entity ID of the switch controlling the DOWN direction.    |
| `duration`    | `number` | No       | `10`                   | Time in seconds to keep the switch on for full open/close. |

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Enjoy seamless shutter control with your Home Assistant dashboard!

