# [codedorian.com](https://codedorian.com)

```ruby
def reset!(clazz)
  p clazz
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
