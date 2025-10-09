# [codedorian.com](https://codedorian.com)

```ruby
SolidQueue::Job.where.not(finished_at: nil).delete_all
```

```ruby
def puts_and_execute(command)
  puts command
  puts eval(command)
end

puts_and_execute("Rpush::Apns::Feedback.delete_all")
puts_and_execute("Rpush::Notification.delete_all")
puts_and_execute("Rpush::App.delete_all")
puts_and_execute("JobContext.delete_all")
puts_and_execute("SolidErrors::Occurrence.delete_all")
puts_and_execute("SolidErrors::Error.destroy_all.size")
puts_and_execute("SolidQueue::BlockedExecution.delete_all")
puts_and_execute("SolidQueue::ClaimedExecution.delete_all")
puts_and_execute("SolidQueue::FailedExecution.delete_all")
puts_and_execute("SolidQueue::ReadyExecution.delete_all")
puts_and_execute("SolidQueue::Job.delete_all")
puts_and_execute("SolidQueue::Pause.delete_all")
puts_and_execute("SolidQueue::Process.delete_all")
puts_and_execute("SolidQueue::RecurringExecution.delete_all")
puts_and_execute("SolidQueue::RecurringTask.delete_all")
puts_and_execute("SolidQueue::ScheduledExecution.delete_all")
puts_and_execute("SolidQueue::Semaphore.delete_all")

load "db/seeds.rb"
```

```ruby
puts User.admin.map { |user| user.programs.map { |program| "#{program.name}\n\n`\n#{program.input}\n`\n" }.join("\n") }.join("\n")
```
