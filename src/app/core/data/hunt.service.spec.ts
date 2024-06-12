import { HuntService } from './hunt.service'
import { ScavengerHunt } from '../../types/hunt.types'
import { Preferences } from '@capacitor/preferences'

describe('HuntService', () => {
    let service: HuntService

    beforeEach(() => {
        service = new HuntService()
    })

    it('should save hunts to Preferences', async () => {
        const dummyHunt: ScavengerHunt = {
            name: 'Dummy Hunt',
            rewards: 10,
            penalties: 5,
            time: { start: new Date(), end: new Date() },
            date: new Date(),
        }
        const setSpy = spyOn(Preferences, 'set').and.returnValue(
            Promise.resolve()
        )

        await service.saveHunts([dummyHunt])
        expect(setSpy).toHaveBeenCalledWith({
            key: 'hunts',
            value: JSON.stringify([dummyHunt]),
        })
    })

    it('should properly handle ScavengerHunt type', async () => {
        const dummyHunt: ScavengerHunt = {
            name: 'Test Hunt',
            rewards: 10,
            penalties: 5,
            time: { start: new Date(), end: new Date() },
            date: new Date(),
        }

        await service.saveHunts([dummyHunt])

        const hunts = await service.getHunts()

        expect(hunts.length).toEqual(1)
        expect(new Date(hunts[0].time.start).toISOString()).toBe(
            new Date(dummyHunt.time.start).toISOString()
        )
        expect(new Date(hunts[0].time.end).toISOString()).toBe(
            new Date(dummyHunt.time.end).toISOString()
        )
        expect(new Date(hunts[0].date).toISOString()).toBe(
            new Date(dummyHunt.date).toISOString()
        )
    })

    it('should get hunts from Preferences', async () => {
        const dummyHunts: ScavengerHunt[] = [
            {
                name: 'Test Hunt',
                rewards: 10,
                penalties: 5,
                time: { start: new Date(), end: new Date() },
                date: new Date(),
            },
        ]
        spyOn(Preferences, 'get').and.returnValue(
            Promise.resolve({ value: JSON.stringify(dummyHunts) })
        )

        const hunts = await service.getHunts()
        expect(hunts).toEqual(dummyHunts)
    })

    it('should return an empty array if no hunts are stored', async () => {
        spyOn(Preferences, 'get').and.returnValue(
            Promise.resolve({ value: null })
        )

        const hunts = await service.getHunts()
        expect(hunts).toEqual([])
    })

    it('should delete a hunt from the list', async () => {
        const dummyHunts: ScavengerHunt[] = [
            {
                name: 'Dummy Hunt 1',
                rewards: 10,
                penalties: 5,
                time: { start: new Date(), end: new Date() },
                date: new Date(),
            },
            {
                name: 'Dummy Hunt 2',
                rewards: 10,
                penalties: 5,
                time: { start: new Date(), end: new Date() },
                date: new Date(),
            },
        ]
        spyOn(service, 'getHunts').and.returnValue(Promise.resolve(dummyHunts))
        const saveSpy = spyOn(service, 'saveHunts').and.returnValue(
            Promise.resolve()
        )

        const indexToDelete = 0
        await service.deleteHunt(indexToDelete)
        const updatedHunts = dummyHunts.filter(
            (_, index) => index !== indexToDelete
        )
        expect(saveSpy).toHaveBeenCalledWith(updatedHunts)
    })
})
