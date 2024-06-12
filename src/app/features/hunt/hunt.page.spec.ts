import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HuntPage } from './hunt.page'

describe('NewHuntPage', () => {
    let component: HuntPage
    let fixture: ComponentFixture<HuntPage>

    beforeEach(async () => {
        fixture = TestBed.createComponent(HuntPage)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
