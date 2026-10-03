// 修改这里来设置反馈内容。推送到 GitHub 后 Vercel 会自动重新部署。
// 修改 id 会开启一轮全新的收集（旧数据仍保留在数据库里，只是不再显示）。
export default {
  id: 'feedback-1',
  title: '匿名意见反馈',
  question: '有什么想说的，都可以写在这里',
  description: '完全匿名：不需要登录，不记录姓名、IP 或任何身份信息。可以提交多条。',
  // 留空就是纯意见箱；填上选项则变成投票 + 留言
  options: [],
  allowComment: true,
  commentPlaceholder: '写下你的意见或建议（最多 500 字）',
  // true：所有人都能看到大家的意见
  // false：只有带 ?key=你的ADMIN_KEY 访问时才能看到
  publicResults: true,
};
