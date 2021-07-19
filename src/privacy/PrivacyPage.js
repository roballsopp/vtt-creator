import * as React from 'react'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PageContainer from '../common/PageContainer'

export default function PrivacyPage() {
	return (
		<PageContainer>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<Typography variant="h4">Privacy Policy</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2" paragraph>
						If you choose to use our service, then you agree to the collection and use of your personal information as
						described by this policy.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We collect information and content you provide.</strong> This includes information you provide when
						you sign up and the audio component of video files you load into the editor for automatic transcription.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We collect data about your usage.</strong> We collect information about how you use vtt-creator,
						such as the features you use; the actions you take; and the time, frequency and duration of your activities.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We collect information about transactions made using our services.</strong> If you use
						vtt-creator&apos;s automatic transcription feature, you&apos;ll be asked to purchase credits with
						vtt-creator. We collect information about these purchases, such as the date and time of purchase, and
						information necessary to identify the PayPal order, including your PayPal email.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We use others to help us provide our services</strong>. This includes PayPal for monetary
						transactions, Google Cloud for speech-to-text transcription, and Amazon Web Services for user account
						management. They will have access to your information as reasonably necessary to perform these tasks on our
						behalf. However, they are obligated not to disclose or use the information for any other purpose.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We or our partners may use cookies to collect and store your information.</strong> Cookies are files
						with a small amount of data that is commonly used an anonymous unique identifier. These may be sent to your
						browser from websites you visit and are stored on your computer&apos;s hard drive. Our website may use these
						cookies to collection information and to improve our services. You have the option to either accept or
						refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our
						cookies, you may not be able to use some portions of our service.
					</Typography>
					<Typography variant="body2" paragraph>
						<strong>We do not knowingly collect personal identifiable information from children under 13.</strong> In
						the case we discover that a child under 13 has provided us with personal information, we immediately delete
						this from our servers. If you are a parent or guardian and you are aware that your child has provided us
						with personal information, please contact us so that we perform the necessary actions.
					</Typography>
					<Typography variant="body2" paragraph>
						We value your trust in providing us your personal information, thus we are striving to use commercially
						acceptable means of protecting it. But remember that no method of transmission over the internet, or method
						of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
					</Typography>
					<Typography variant="body2" paragraph>
						We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for
						any changes. Changes are effective immediately once posted here.
					</Typography>
					<Typography variant="body2" paragraph>
						If you have any questions or suggestions about our Privacy Policy, do not hesitate to{' '}
						<Link href="mailto:vttcreator@gmail.com">contact us</Link>.
					</Typography>
				</Grid>
			</Grid>
		</PageContainer>
	)
}
