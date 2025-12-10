# [codedorian.com](https://codedorian.com)

```ruby
def reset!(clazz)
  puts clazz
  p ActiveRecord::Base.connection.execute(
    "truncate #{clazz.table_name} restart identity cascade"
  )
end

reset!(Rpush::Apns::Feedback)
reset!(Rpush::Notification)
reset!(Rpush::App)
reset!(PaperTrail::Version)
reset!(JobContext)
reset!(SolidErrors::Occurrence)
reset!(SolidErrors::Error)
reset!(SolidQueue::BlockedExecution)
reset!(SolidQueue::ClaimedExecution)
reset!(SolidQueue::FailedExecution)
reset!(SolidQueue::ReadyExecution)
reset!(SolidQueue::Job)
reset!(SolidQueue::Pause)
reset!(SolidQueue::Process)
reset!(SolidQueue::RecurringExecution)
reset!(SolidQueue::RecurringTask)
reset!(SolidQueue::ScheduledExecution)
reset!(SolidQueue::Semaphore)

load "db/seeds.rb"
```

```ruby
def count(clazz)
  puts clazz
  puts clazz.count
end

count(Rpush::Apns::Feedback)
count(Rpush::Notification)
count(Rpush::App)
count(PaperTrail::Version)
count(JobContext)
count(SolidErrors::Occurrence)
count(SolidErrors::Error)
count(SolidQueue::BlockedExecution)
count(SolidQueue::ClaimedExecution)
count(SolidQueue::FailedExecution)
count(SolidQueue::ReadyExecution)
count(SolidQueue::Job)
count(SolidQueue::Pause)
count(SolidQueue::Process)
count(SolidQueue::RecurringExecution)
count(SolidQueue::RecurringTask)
count(SolidQueue::ScheduledExecution)
count(SolidQueue::Semaphore)
```
