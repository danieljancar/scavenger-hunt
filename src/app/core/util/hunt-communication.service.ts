import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class HuntCommunicationService {
    private cancelHuntSubject = new Subject<void>()

    cancelHunt$ = this.cancelHuntSubject.asObservable()

    cancelHunt() {
        this.cancelHuntSubject.next()
    }
}
