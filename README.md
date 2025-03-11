I'm bad at names so calling it Dashboardy.

Working on something that will take in an excel (exported from MPP) and render it inside this React dashboard.

The default structure is based on Silicon IP development phases and I'm using SerDes IP development as an example right now. But next step after working out the kinks, I want to make this more customizable and generic so users can just add metrics, phases they're interested in whether it's GPU or AI Accelerator.

Ultimately, it should work for any type of projecct and you can add charts and maybe extend to Jira and other project management tools.

## How to run
Follow these steps

```bash
git clone https://github.com/yomogiu/dashboardy.git
cd dashboardy
npm install
npm start