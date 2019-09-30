import Mail from '../../lib/mail'

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail'
  }

  async handle({ data }) {
    const { meetup, name, subscription } = data

    console.log('SubscriptionMail queue')

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `${name} was subscribed your meetup`,
      template: 'newsubscriber',
      context: {
        name,
        meetup,
        date: subscription.createdAt
      }
    })
  }
}
export default new SubscriptionMail()
