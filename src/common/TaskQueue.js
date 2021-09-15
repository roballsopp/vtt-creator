import EventEmitter from 'events'

export const QUEUE_EVENT_CANCEL_DISABLED = 'cancel-disabled'
export const QUEUE_EVENT_CANCELLING = 'cancelling'
export const QUEUE_EVENT_CANCELLED = 'cancelled'
export const QUEUE_EVENT_QUEUE_STATE = 'state-change'
export const QUEUE_EVENT_ERROR = 'error'
export const QUEUE_EVENT_DONE = 'done'

export default class TaskQueue extends EventEmitter {
	constructor(queue = []) {
		super()
		this._queue = queue
		this._currentTask = null
		this._cancelled = false
		this.inProgress = false
		this.cancelDisabled = false
	}

	async run(startCtx = {}) {
		this.inProgress = true

		try {
			let prevTaskPromise = Promise.resolve(startCtx)

			for (let i = 0; i < this._queue.length; i++) {
				const currentTask = this._queue[i]
				// wait for the previous task to finish
				const runContext = await prevTaskPromise
				// if we cancelled some time during the previous task, don't continue
				if (this._cancelled) {
					this.inProgress = false
					return
				}
				// start the current task, passing the context from the previous task
				this._currentTask = currentTask.run(runContext, this)
				prevTaskPromise = this._currentTask.promise
			}

			const result = await prevTaskPromise

			this.inProgress = false

			// we could still have cancelled during the last task, and we need to not send a completion event if so
			if (this._cancelled) return

			this.emit(QUEUE_EVENT_DONE, result)
		} catch (e) {
			this.inProgress = false
			this.emit(QUEUE_EVENT_ERROR, e)
		}
	}

	disableCancel() {
		this.cancelDisabled = true
		this.emit(QUEUE_EVENT_CANCEL_DISABLED, true)
	}

	enableCancel() {
		this.cancelDisabled = false
		this.emit(QUEUE_EVENT_CANCEL_DISABLED, false)
	}

	async cancel() {
		if (!this.cancelDisabled) {
			this._cancelled = true
			this.emit(QUEUE_EVENT_CANCELLING)
			if (this._currentTask?.cancel) await this._currentTask.cancel()
			await this._currentTask.promise
			this.inProgress = false
			this.emit(QUEUE_EVENT_CANCELLED)
		}
	}
}
