# TaskSurface — 3-minute YouTube demo script

**Target duration:** 2 minutes 35 seconds to 2 minutes 50 seconds.

**Language:** English narration with optional English captions.

**Recording URL:** https://tasksurface-nlgt6zklja-an.a.run.app
**Core message:** WebMCP should not merely let an agent call tools. It should
give people a focused, shared surface to supervise, correct, and approve work.

## Before recording

1. Open the live app in a desktop viewport and verify that `Order #TS-1042`
   appears.
2. If recording a genuine WebMCP interaction, use the ChatGPT desktop app's
   in-app browser, or Chrome with `chrome://flags/#enable-webmcp-testing`
   enabled. Keep the agent/browser tooling visible only if it helps the viewer;
   the TaskSurface UI should remain the focal point.
3. Turn off notifications and prepare a clean browser profile.
4. Record at 1440p or 1080p. Use no copyrighted music or third-party brand
   footage.
5. Do not show `.env` files, Cloud Console secret values, database URLs, or
   personal browser tabs.

## Shot-by-shot script

| Time | On-screen action | English narration | 日本語訳 |
| --- | --- | --- | --- |
| 0:00–0:12 | Start on the full TaskSurface order dashboard. Pause briefly on the three tasks and the order items. | “This is TaskSurface: a WebMCP-native workspace where people and agents work on the same task, not in separate chat and dashboard windows.” | 「これはTaskSurfaceです。人とAgentが、チャットとダッシュボードに分断されず、同じタスク上で協働するためのWebMCPネイティブなワークスペースです。」 |
| 0:12–0:24 | Point to the normal order information. Read the request aloud or show it as an overlay: *Return only the red T-shirt from order TS-1042.* | “A normal ecommerce dashboard contains far more information than this request needs. The agent should not force the merchant to watch a stream of clicks.” | 「通常のECダッシュボードには、この依頼に不要な情報が大量にあります。Agentのクリック履歴を商人が追い続ける必要はありません。」 |
| 0:24–0:40 | Click **Return an item**. Let the focused task screen appear. | “When the task begins, the interface morphs into a focused refund surface. It preserves the selected item and the decisions that still need human judgment.” | 「タスクが始まると、UIは返品に集中した画面へ変形します。選択された商品と、人間の判断が必要な選択だけを残します。」 |
| 0:40–0:58 | Highlight the **Agent presence** timeline, then the **Live WebMCP tools** chips. If possible, show the browser/agent recognizing a tool. | “The capability panel comes from live WebMCP tools. TaskSurface registers only the tools useful in this page state, so the person can see what the agent can do right now.” | 「Capabilityパネルは、現在有効なWebMCPツールから生まれます。TaskSurfaceはこのページ状態で必要なツールだけを登録するため、人はAgentが今できることを確認できます。」 |
| 0:58–1:18 | Highlight the selected red T-shirt and then the **Semantic preview**. | “Instead of exposing raw JSON or hidden side effects, the preview explains the business outcome: the item, the refund destination, and the order-status change.” | 「生のJSONや見えない副作用ではなく、プレビューはビジネス上の結果を説明します。対象商品、返金先、注文ステータスの変更です。」 |
| 1:18–1:35 | Click **Store credit** instead of Visa. Pause to show the preview change. | “The agent prepared the task, but the merchant changes one important decision: use store credit instead of the original card. The preview updates immediately.” | 「Agentがタスクを準備しますが、商人は重要な判断を一つ変更します。元のカードではなくストアクレジットにします。プレビューはすぐに更新されます。」 |
| 1:35–1:55 | Tick the approval checkbox. Point at the enabled **Commit refund** button. Click it once. | “The final action requires explicit merchant approval. That guard is enforced in the UI and again in the API, so the agent cannot silently commit a consequential change.” | 「最終アクションには、商人による明示的な承認が必要です。このガードはUIだけでなくAPIでも強制されるため、Agentが重要な変更を黙って確定することはできません。」 |
| 1:55–2:13 | Return to the dashboard. Quickly click **Change delivery address**, then return. Click **Cancel shipment**, then return. Do not commit either. | “The same pattern works for delivery changes and shipment cancellation: dynamic capabilities, a focused surface, a semantic preview, and a human final decision.” | 「同じパターンは配送先変更や配送キャンセルにも使えます。動的なcapability、集中した画面、semantic preview、そして人間による最終判断です。」 |
| 2:13–2:35 | Return to the main dashboard. End with the TaskSurface logo and project URL/repository URL as a clean title card. | “TaskSurface explores a simple idea: in the agent-native web, UI should represent the work that humans and agents are solving together. Built with WebMCP, Next.js, Neon, and Google Cloud Run.” | 「TaskSurfaceはシンプルな考えを探求します。AgentネイティブなWebでは、UIは人とAgentが一緒に解決している仕事を表すべきです。WebMCP、Next.js、Neon、Google Cloud Runで構築しました。」 |

## Optional opening title card

Display for no more than three seconds before the first shot:

```text
TASKSURFACE
Turn live WebMCP capabilities into a shared task workspace.
```

## Optional closing card

```text
Live demo: tasksurface-nlgt6zklja-an.a.run.app
Source: github.com/Kotakageyama/webMCP
```

## YouTube upload checklist

- Use the title: **TaskSurface — A shared task workspace for humans and agents with WebMCP**
- Set visibility to **Public** before copying the URL into Devpost.
- Confirm the final duration is under three minutes.
- Ensure the spoken explanation covers both the product and the WebMCP implementation.
- Add English captions if narration is difficult to hear.
- Use the final public YouTube URL in the Devpost submission form.
