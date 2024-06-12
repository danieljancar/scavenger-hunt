import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { By } from '@angular/platform-browser'

import { FeedbackComponent } from './feedback.component'
import { FeedbackIconType } from '../../enums/feedback. enums'

describe('FeedbackComponent', () => {
    let component: FeedbackComponent
    let fixture: ComponentFixture<FeedbackComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(FeedbackComponent)
        component = fixture.componentInstance
    }))
    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should have default icon as INFO', () => {
        expect(component.icon).toEqual(FeedbackIconType.INFO)
    })

    it('should have default title as Feedback', () => {
        expect(component.title).toEqual('Feedback')
    })

    it('should have default message as This is a feedback message.', () => {
        expect(component.message).toEqual('This is a feedback message.')
    })

    it('should display the correct icon', () => {
        component.icon = FeedbackIconType.ERROR
        fixture.detectChanges()
        const iconElement = fixture.debugElement.query(
            By.css('ion-icon')
        ).nativeElement
        expect(iconElement.name).toEqual(FeedbackIconType.ERROR)
    })

    it('should display the correct title', () => {
        component.title = 'Test Title'
        fixture.detectChanges()
        const titleElement = fixture.debugElement.query(
            By.css('ion-card-title')
        ).nativeElement
        expect(titleElement.textContent).toContain('Test Title')
    })

    it('should display the correct message', () => {
        component.message = 'Test Message'
        fixture.detectChanges()
        const messageElement = fixture.debugElement.query(
            By.css('ion-card-content p')
        ).nativeElement
        expect(messageElement.textContent).toEqual('Test Message')
    })
})
