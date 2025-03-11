I'm bad at names so calling it Dashboardy.

Working on something that will take in an excel (exported from MPP) and render it inside this React dashboard.

The default structure is based on Silicon IP development phases and I'm using a SerDes IP as an example right now. But ultimately I want to make this more customizable and generic so users can just add metrics, phases they're interested in whether it's GPU or AI Accelerator.

## How to run
Follow these steps

```bash
git clone https://github.com/yomogiu/dashboardy.git
cd dashboardy
npm install
npm start