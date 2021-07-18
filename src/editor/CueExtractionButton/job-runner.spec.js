import {ApolloClient, ApolloLink, InMemoryCache, from, Observable} from '@apollo/client'
import {v4 as uuid} from 'uuid'
import EventEmitter from 'events'
import chai from 'chai'
import spies from 'chai-spies'
import audioFileUrl from './test_tone.wav'
import {
	EVENT_CANCEL_DISABLED,
	EVENT_ERROR,
	EVENT_JOB_STATE,
	JOB_STATE_EXTRACTING,
	JOB_STATE_TRANSCRIBING,
	JOB_STATE_UPLOADING,
	getJobRunner,
	EVENT_DONE,
	JOB_STATE_CANCELLING,
	JOB_STATE_CANCELLED,
	JOB_STATE_FAILED,
} from './job-runner'

chai.use(spies)

describe('JobRunner', function() {
	describe('when a job is started, and audio is successfully extracted', function() {
		beforeEach(function(done) {
			this.apolloEvents = new EventEmitter()
			const dummyLink = new ApolloLink(operation => {
				this.lastOp = operation
				return new Observable(observer => {
					this.linkObserver = observer
					this.apolloEvents.emit('op', operation, observer)
				})
			})

			window.gtag = chai.spy()
			const apolloClient = new ApolloClient({link: from([dummyLink]), cache: new InMemoryCache()})
			this.uploadFileSpy = chai.spy(() => Promise.resolve())
			this.runner = getJobRunner(apolloClient, this.uploadFileSpy)

			this.expectedLanguage = 'en-US'
			// actually an audio file, but audiocontext doesn't care
			this.jobStateEvents = []
			this.cancelDisabledEvents = []
			this.errorEvents = []
			this.doneEvents = []
			this.runner.on(EVENT_JOB_STATE, state => {
				this.jobStateEvents.push(state)
			})
			this.runner.on(EVENT_CANCEL_DISABLED, disabled => {
				this.cancelDisabledEvents.push(disabled)
			})
			this.runner.on(EVENT_ERROR, err => {
				this.errorEvents.push(err)
			})
			this.runner.on(EVENT_DONE, result => {
				this.doneEvents.push(result)
			})
			// start assertions at the first graphql call, which should be to get an upload url
			this.apolloEvents.once('op', () => done())
			getTestFile()
				.then(videoFile => {
					this.jobPromise = this.runner.run({
						videoFile,
						duration: 1,
						languageCode: this.expectedLanguage,
						pollInterval: 10,
					})
				})
				.catch(done)
		})

		it(`the job is immediately marked 'in progress'`, function() {
			chai.expect(this.runner.inProgress).to.equal(true)
		})

		it('two events are fired', function() {
			chai.expect(this.jobStateEvents).to.have.length(2)
		})

		it(`an 'extracting' event is fired first`, function() {
			chai.expect(this.jobStateEvents[0]).to.equal(JOB_STATE_EXTRACTING)
		})

		it(`an 'uploading' event is fired second`, function() {
			chai.expect(this.jobStateEvents[1]).to.equal(JOB_STATE_UPLOADING)
		})

		it(`cancelling the job should be allowed`, function() {
			chai.expect(this.runner.cancelDisabled).to.equal(false)
			chai.expect(this.cancelDisabledEvents).to.have.length(0)
		})

		it(`the pending operation should be to retrieve an upload url`, function() {
			chai.expect(this.lastOp.operationName).to.equal('getUploadUrl')
		})

		it(`no errors are emitted`, function() {
			chai.expect(this.errorEvents).to.have.length(0)
		})

		it('no done events are emitted', function() {
			chai.expect(this.doneEvents).to.have.length(0)
		})

		describe('then, if an upload url is successfully retrieved', function() {
			beforeEach(function(done) {
				this.expectedFileName = uuid()
				this.expectedUploadUrl = uuid()
				// start assertions at the next graphql call, which should be to start the transcription
				this.apolloEvents.once('op', () => done())
				this.linkObserver.next({data: {uploadUrl: {filename: this.expectedFileName, url: this.expectedUploadUrl}}})
				this.linkObserver.complete()
			})

			it(`the job is still 'in progress'`, function() {
				chai.expect(this.runner.inProgress).to.equal(true)
			})

			it(`an upload has been started to the correct endpoint`, function() {
				chai.expect(this.uploadFileSpy).to.have.been.called.with(this.expectedUploadUrl)
			})

			it('a third event has been fired', function() {
				chai.expect(this.jobStateEvents).to.have.length(3)
			})

			it(`the third event should be the transcribing event`, function() {
				chai.expect(this.jobStateEvents[2]).to.equal(JOB_STATE_TRANSCRIBING)
			})

			it(`cancelling the job should be disabled`, function() {
				chai.expect(this.runner.cancelDisabled).to.equal(true)
				chai.expect(this.cancelDisabledEvents).to.have.length(1)
				chai.expect(this.cancelDisabledEvents[0]).to.equal(true)
			})

			it(`the pending operation should be to start a transcription job`, function() {
				chai.expect(this.lastOp.operationName).to.equal('initTranscription')
			})

			it(`the transcription job should run against the uploaded file`, function() {
				chai.expect(this.lastOp.variables.filename).to.equal(this.expectedFileName)
			})

			it(`the transcription job should run with the specified language`, function() {
				chai.expect(this.lastOp.variables.languageCode).to.equal(this.expectedLanguage)
			})

			it(`no errors are emitted`, function() {
				chai.expect(this.errorEvents).to.have.length(0)
			})

			it('no done events are emitted', function() {
				chai.expect(this.doneEvents).to.have.length(0)
			})

			describe('then, if a transcription is successfully started', function() {
				beforeEach(function(done) {
					this.expectedJobId = uuid()
					// start assertions at the next graphql call, which should be to poll the transcription
					this.apolloEvents.once('op', () => done())
					this.linkObserver.next({data: {beginTranscription: {job: {id: this.expectedJobId}}}})
					this.linkObserver.complete()
				})

				it(`no errors are emitted`, function() {
					chai.expect(this.errorEvents).to.have.length(0)
				})

				it('no done events are emitted', function() {
					chai.expect(this.doneEvents).to.have.length(0)
				})

				it(`the job is still 'in progress'`, function() {
					chai.expect(this.runner.inProgress).to.equal(true)
				})

				it(`the pending operation should be to poll the transcription job`, function() {
					chai.expect(this.lastOp.operationName).to.equal('getTranscriptionJob')
				})

				describe('then, if the first check is successful, but the job is not yet complete', function() {
					beforeEach(function(done) {
						// start assertions at the next graphql call, which should be to poll the transcription again
						this.apolloEvents.once('op', () => done())
						this.linkObserver.next({data: {transcriptionJob: {state: 'pending'}}})
						this.linkObserver.complete()
					})

					it(`no errors are emitted`, function() {
						chai.expect(this.errorEvents).to.have.length(0)
					})

					it('no done events are emitted', function() {
						chai.expect(this.doneEvents).to.have.length(0)
					})

					it(`the job is still 'in progress'`, function() {
						chai.expect(this.runner.inProgress).to.equal(true)
					})

					it(`the pending operation should be to poll the transcription job again`, function() {
						chai.expect(this.lastOp.operationName).to.equal('getTranscriptionJob')
					})

					describe('when the second check is successful and the job is complete', function() {
						beforeEach(async function() {
							this.expectedTranscript = {words: []}
							this.linkObserver.next({
								data: {transcriptionJob: {state: 'success', transcript: this.expectedTranscript}},
							})
							this.linkObserver.complete()

							await this.jobPromise
						})

						it(`no errors are emitted`, function() {
							chai.expect(this.errorEvents).to.have.length(0)
						})

						it(`the job is no longer 'in progress'`, function() {
							chai.expect(this.runner.inProgress).to.equal(false)
						})

						it(`the transcript should be returned via the done event`, function() {
							chai.expect(this.doneEvents).to.have.length(1)
							chai.expect(this.expectedTranscript).to.equal(this.doneEvents[0].transcript)
						})
					})
				})

				describe('then, if an error occurs during the first check', function() {
					beforeEach(function() {
						this.linkObserver.error(new Error('error polling transcription'))
						return this.jobPromise
					})

					it(`the job is no longer 'in progress'`, function() {
						chai.expect(this.runner.inProgress).to.equal(false)
					})

					it(`an error is emitted`, function() {
						chai.expect(this.errorEvents).to.have.length(1)
					})

					it(`the job state is failed`, function() {
						chai.expect(this.jobStateEvents).to.have.length(4)
						chai.expect(this.jobStateEvents[2]).to.equal(JOB_STATE_TRANSCRIBING)
						chai.expect(this.jobStateEvents[3]).to.equal(JOB_STATE_FAILED)
					})
				})

				describe('then, if the job is cancelled during polling', function() {
					beforeEach(function() {
						// when we call runner.cancel(), we'll launch a new apollo operation, and overwrite the observer we had
						//   for the transcription call. lets cache the observer we have now so we don't lose it
						const getTransJobObserver = this.linkObserver

						this.cancelPromise = this.runner.cancel()
						getTransJobObserver.next({data: {transcriptionJob: {id: 'id', state: 'pending'}}})
						getTransJobObserver.complete()
						return this.jobPromise
					})

					it(`the job is no longer 'in progress'`, function() {
						// TODO: it may make sense to keep the job in progress until the cancellation is fully complete
						chai.expect(this.runner.inProgress).to.equal(false)
					})

					it(`no error is emitted`, function() {
						chai.expect(this.errorEvents).to.have.length(0)
					})

					it('no done events are emitted', function() {
						chai.expect(this.doneEvents).to.have.length(0)
					})

					it(`the cancelling event is emitted`, function() {
						chai.expect(this.jobStateEvents).to.have.length(4)
						chai.expect(this.jobStateEvents[3]).to.equal(JOB_STATE_CANCELLING)
					})

					it(`the pending operation should be to cancel the transcription job`, function() {
						chai.expect(this.lastOp.operationName).to.equal('cancelTranscription')
					})

					describe('then, when the cancellation completes', function() {
						beforeEach(function() {
							this.linkObserver.next({data: {transcriptionJob: {id: 'id', state: 'pending'}}})
							this.linkObserver.complete()
							return this.cancelPromise
						})

						it(`the job is still not 'in progress'`, function() {
							chai.expect(this.runner.inProgress).to.equal(false)
						})

						it(`no error is emitted`, function() {
							chai.expect(this.errorEvents).to.have.length(0)
						})

						it('no done events are emitted', function() {
							chai.expect(this.doneEvents).to.have.length(0)
						})

						it(`the cancelled event is emitted`, function() {
							chai.expect(this.jobStateEvents).to.have.length(5)
							chai.expect(this.jobStateEvents[4]).to.equal(JOB_STATE_CANCELLED)
						})
					})
				})
			})

			describe('then, if an error occurs during transcription init', function() {
				beforeEach(function() {
					this.linkObserver.error(new Error('error starting transcription'))
					return this.jobPromise
				})

				it(`the job is no longer 'in progress'`, function() {
					chai.expect(this.runner.inProgress).to.equal(false)
				})

				it(`an error is emitted`, function() {
					chai.expect(this.errorEvents).to.have.length(1)
				})

				it(`the job state is failed`, function() {
					chai.expect(this.jobStateEvents).to.have.length(4)
					chai.expect(this.jobStateEvents[2]).to.equal(JOB_STATE_TRANSCRIBING)
					chai.expect(this.jobStateEvents[3]).to.equal(JOB_STATE_FAILED)
				})

				it(`the next graphql call is not attempted (the most recent call is still initTranscription)`, function() {
					chai.expect(this.lastOp.operationName).to.equal('initTranscription')
				})
			})

			describe('then, if a cancellation attempt is made during transcription init', function() {
				beforeEach(function(done) {
					this.runner.cancel()
					// cancellation should be blocked here, so we should proceed as normal
					this.apolloEvents.once('op', () => done())
					this.linkObserver.next({data: {beginTranscription: {job: {id: this.expectedJobId}}}})
					this.linkObserver.complete()
				})

				it(`the job is still 'in progress'`, function() {
					chai.expect(this.runner.inProgress).to.equal(true)
				})

				it(`no error is emitted`, function() {
					chai.expect(this.errorEvents).to.have.length(0)
				})

				it('no done events are emitted', function() {
					chai.expect(this.doneEvents).to.have.length(0)
				})

				it(`no cancellation events are emitted`, function() {
					chai.expect(this.jobStateEvents).to.have.length(3)
					chai.expect(this.jobStateEvents[2]).to.equal(JOB_STATE_TRANSCRIBING)
				})

				it(`the pending operation should be to poll the transcription job`, function() {
					chai.expect(this.lastOp.operationName).to.equal('getTranscriptionJob')
				})
			})
		})

		describe('then an upload url is not successfully retrieved', function() {
			beforeEach(function() {
				this.linkObserver.error(new Error('error getting upload url'))
				return this.jobPromise
			})

			it(`the job is no longer 'in progress'`, function() {
				chai.expect(this.runner.inProgress).to.equal(false)
			})

			it(`an error is emitted`, function() {
				chai.expect(this.errorEvents).to.have.length(1)
			})

			it(`the next graphql call is not attempted (the most recent call is still this one)`, function() {
				chai.expect(this.lastOp.operationName).to.equal('getUploadUrl')
			})
		})

		describe('then, when the job is cancelled during upload url retrieval', function() {
			beforeEach(function() {
				this.runner.cancel()
				this.expectedFileName = uuid()
				this.expectedUploadUrl = uuid()
				// in this case, since we cancelled, we never will get the next graphql call
				this.linkObserver.next({data: {uploadUrl: {filename: this.expectedFileName, url: this.expectedUploadUrl}}})
				this.linkObserver.complete()
				return this.jobPromise
			})

			it(`the job is no longer 'in progress'`, function() {
				chai.expect(this.runner.inProgress).to.equal(false)
			})

			it(`no error is emitted`, function() {
				chai.expect(this.errorEvents).to.have.length(0)
			})

			it('no done events are emitted', function() {
				chai.expect(this.doneEvents).to.have.length(0)
			})

			it(`cancelling and cancelled events are emitted`, function() {
				chai.expect(this.jobStateEvents).to.have.length(4)
				chai.expect(this.jobStateEvents[2]).to.equal(JOB_STATE_CANCELLING)
				chai.expect(this.jobStateEvents[3]).to.equal(JOB_STATE_CANCELLED)
			})
		})
	})
})

function getTestFile() {
	return new Promise(resolve => {
		const request = new XMLHttpRequest()
		request.open('GET', audioFileUrl, true)
		request.responseType = 'blob'
		request.onload = function() {
			resolve(request.response)
		}
		request.send()
	})
}
