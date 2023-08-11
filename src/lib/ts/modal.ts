import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";


enum ModalId {
    FindModuleModal = 1,
    AddModuleModal = 2,
    SettingsModal = 3,
}


type ModalType = {
    id: ModalId;
    info: any;
}


export function openModal(wid: ModalId, info?: any): boolean {
    /*
    if window is not open already:
        opens a window with the window id we specify, ret true
    else:
        do nothing, ret false
    */
    let modalIsOpenedAlready: boolean = false;
    get(modalStack).forEach((windowObject) => {
        if (windowObject.id == wid) {
            modalIsOpenedAlready = true;
        }
    });
    if (modalIsOpenedAlready) {
        console.warn(`Modal of id ${wid} is open already!!`);
        return false;
    }
    modalStack.update(modalStackUpdated => {
        modalStackUpdated.push({id: wid, info: info ?? {}});
        return modalStackUpdated;
    });
    modalStackInstanceId.update(_ => _+1);
    return true;
}


export function closeAllModals(): void {
    modalStack.update(_ => []);
    modalStackInstanceId.update(_ => _+1);
}


export function getOpenModal(wid: ModalId): any {
    /*
    if window is open:
        ret window.info
    else:
        ret undefined
    */
    let retValue = undefined;
    get(modalStack).forEach(modalObj => {
        if (modalObj.id == wid) {
            retValue = modalObj.info;
        }
    });
    return retValue;
}


const modalStack: Writable<Array<ModalType>> = writable([]);
export const modalStackInstanceId: Writable<number> = writable(0);
