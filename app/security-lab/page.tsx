import SecurityLab from "./security-lab";

export const metadata = {
  title: "WebMCP セキュリティ体験 | TaskSurface",
  description: "WebMCP の権限境界とプロンプトインジェクションを安全に説明する体験ページ"
};

export default function SecurityLabPage() {
  return <SecurityLab />;
}
