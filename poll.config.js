// 修改这里来设置投票内容。改完重新部署即可（npx vercel --prod）。
// 修改 id 会开启一轮全新的投票（旧数据仍保留在数据库里，只是不再显示）。
export default {
  id: 'poll-1',
  title: '匿名投票与意见反馈',
  question: '你对这次活动的整体满意度如何？',
  description: '完全匿名：不需要登录，不记录姓名、IP 或任何身份信息。',
  options: ['非常满意', '满意', '一般', '不满意'],
  // 留空 options: [] 就变成纯意见箱
  allowComment: true,
  commentPlaceholder: '有什么想法或建议？（选填，最多 500 字）',
  // true：所有人投票后都能看到结果和留言
  // false：只有带 ?key=你的ADMIN_KEY 访问时才能看到结果
  publicResults: true,
};
