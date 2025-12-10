// Real deep links for South African food delivery and grocery apps

export interface StoreLink {
    name: string
    webUrl: string
    iosDeepLink?: string
    androidDeepLink?: string
    appStoreUrl?: string
    playStoreUrl?: string
}

// Deep links for SA stores
export const storeDeepLinks: Record<string, StoreLink> = {
    uber_eats: {
        name: 'Uber Eats',
        webUrl: 'https://www.ubereats.com/za',
        iosDeepLink: 'ubereats://',
        androidDeepLink: 'ubereats://',
        appStoreUrl: 'https://apps.apple.com/za/app/uber-eats-food-delivery/id1058959277',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab.eats'
    },
    mr_d: {
        name: 'Mr D',
        webUrl: 'https://www.mrd.co.za',
        iosDeepLink: 'mrd://',
        androidDeepLink: 'mrd://',
        appStoreUrl: 'https://apps.apple.com/za/app/mr-d-food/id948aborc31852',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mrd.android'
    },
    checkers: {
        name: 'Checkers Sixty60',
        webUrl: 'https://www.checkers.co.za/sixty60',
        iosDeepLink: 'checkersixty60://',
        androidDeepLink: 'checkersixty60://',
        appStoreUrl: 'https://apps.apple.com/za/app/checkers-sixty60/id1458542495',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.checkers.sixty60'
    },
    pnp: {
        name: 'Pick n Pay',
        webUrl: 'https://www.pnp.co.za',
        iosDeepLink: 'pnp://',
        androidDeepLink: 'pnp://',
        appStoreUrl: 'https://apps.apple.com/za/app/pick-n-pay/id1237796498',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=za.co.picknpay.spree'
    },
    woolworths: {
        name: 'Woolworths',
        webUrl: 'https://www.woolworths.co.za',
        iosDeepLink: 'woolworths://',
        androidDeepLink: 'woolworths://',
        appStoreUrl: 'https://apps.apple.com/za/app/woolworths/id947980358',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=za.co.woolworths'
    },
    nandos: {
        name: "Nando's",
        webUrl: 'https://www.nandos.co.za/eat/order-online',
        iosDeepLink: 'nandos://',
        androidDeepLink: 'nandos://',
        appStoreUrl: 'https://apps.apple.com/za/app/nandos/id1038571961',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nandos.loyalty'
    },
    kfc: {
        name: 'KFC',
        webUrl: 'https://order.kfc.co.za',
        appStoreUrl: 'https://apps.apple.com/za/app/kfc-south-africa/id1500318498',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.yum.kfczar'
    },
    mcdonalds: {
        name: "McDonald's",
        webUrl: 'https://www.mcdonalds.co.za',
        iosDeepLink: 'mcdonalds://',
        androidDeepLink: 'mcdonalds://',
        appStoreUrl: 'https://apps.apple.com/za/app/mcdonalds/id922103212',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mcdonalds.app.za'
    },
    steers: {
        name: 'Steers',
        webUrl: 'https://www.steers.co.za',
        appStoreUrl: 'https://apps.apple.com/za/app/steers/id1538123456',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=za.co.steers'
    }
}

// Detect platform
export function getPlatform(): 'ios' | 'android' | 'web' {
    if (typeof navigator === 'undefined') return 'web'

    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios'
    if (/android/.test(userAgent)) return 'android'
    return 'web'
}

// Generate the best link for the current platform
export function getStoreLink(storeKey: string, fallbackToWeb = true): string {
    const store = storeDeepLinks[storeKey]
    if (!store) return '#'

    const platform = getPlatform()

    switch (platform) {
        case 'ios':
            return store.iosDeepLink || store.appStoreUrl || store.webUrl
        case 'android':
            return store.androidDeepLink || store.playStoreUrl || store.webUrl
        default:
            return store.webUrl
    }
}

// Generate checkout deep link with cart data
export function getCheckoutLink(storeKey: string, items?: { name: string; quantity: number }[]): string {
    const baseLink = getStoreLink(storeKey)
    // In production, you would append cart data as query params
    // For now, just return the base link
    return baseLink
}

// Get app store link for "Download App" prompts
export function getAppDownloadLink(storeKey: string): string | null {
    const store = storeDeepLinks[storeKey]
    if (!store) return null

    const platform = getPlatform()

    switch (platform) {
        case 'ios':
            return store.appStoreUrl || null
        case 'android':
            return store.playStoreUrl || null
        default:
            return null // Web users don't need app download
    }
}

// All stores for listing
export function getAllStores(): StoreLink[] {
    return Object.values(storeDeepLinks)
}
