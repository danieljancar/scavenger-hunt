import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { LoadingComponent } from './loading.component'

describe('LoadingComponent', () => {
    let component: LoadingComponent
    let fixture: ComponentFixture<LoadingComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(LoadingComponent)
        component = fixture.componentInstance
    }))

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should render with the spinner', () => {
        fixture.detectChanges()
        const element = fixture.nativeElement
        const spinner = element.querySelector('ion-spinner')
        expect(spinner).toBeTruthy()
    })

    it('should render title if provided', () => {
        component.title = 'Loading'
        fixture.detectChanges()
        const element = fixture.nativeElement
        const titleElement = element.querySelector('.loading-title')
        expect(titleElement.textContent.trim()).toEqual('Loading')
    })

    it('should render message if provided', () => {
        component.message = 'Please wait...'
        fixture.detectChanges()
        const element = fixture.nativeElement
        const messageElement = element.querySelector('.loading-message')
        expect(messageElement.textContent.trim()).toEqual('Please wait...')
    })

    it('should not render title if not provided', () => {
        fixture.detectChanges()
        const element = fixture.nativeElement
        const titleElement = element.querySelector('.loading-title')
        expect(titleElement).toBeFalsy()
    })

    it('should not render message if not provided', () => {
        fixture.detectChanges()
        const element = fixture.nativeElement
        const messageElement = element.querySelector('.loading-message')
        expect(messageElement).toBeFalsy()
    })
})
