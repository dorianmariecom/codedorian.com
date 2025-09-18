# [codedorian.com](https://codedorian.com)

```
SolidQueue::Job.where.not(finished_at: nil).delete_all

```

puts Rpush::Apns::Feedback.delete_all
puts Rpush::Notification.delete_all
puts Rpush::App.delete_all
puts SolidErrors::Occurrence.delete_all
puts SolidErrors::Error.destroy_all.size
puts SolidQueue::BlockedExecution.delete_all
puts SolidQueue::ClaimedExecution.delete_all
puts SolidQueue::FailedExecution.delete_all
puts SolidQueue::ReadyExecution.delete_all
puts SolidQueue::Job.delete_all
puts SolidQueue::Pause.delete_all
puts SolidQueue::Process.delete_all
puts SolidQueue::RecurringExecution.delete_all
puts SolidQueue::RecurringTask.delete_all
puts SolidQueue::ScheduledExecution.delete_all
puts SolidQueue::Semaphore.delete_all

load "db/seeds.rb"

```

```

puts User.admin.map { |user| user.programs.map { |program| "#{program.name}\n\n`\n#{program.input}\n`\n" }.join("\n") }.join("\n")

```

```
