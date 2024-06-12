import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { GeolocationComponent } from './geolocation.component'

describe('GeolocationComponent', () => {
    let component: GeolocationComponent
    let fixture: ComponentFixture<GeolocationComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [GeolocationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents()

        fixture = TestBed.createComponent(GeolocationComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    }))

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
