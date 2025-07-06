/**
 * Simulates AI-based prioritization of tasks.
 * You can replace this logic with an API call to OpenAI or a fine-tuned model later.
 * 
 * @param {Array} tasks - List of task objects
 * @returns {Array} - Prioritized task list
 */
export const prioritizeTasks = (tasks) => {
  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return [...tasks].sort((a, b) => {
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity

    // Priority Score = (priority weight * 10000) - time until due
    const aScore = (priorityWeight[a.priority] || 1) * 10000 - aDue
    const bScore = (priorityWeight[b.priority] || 1) * 10000 - bDue

    return bScore - aScore
  })
}
