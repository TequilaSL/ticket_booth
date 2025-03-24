export default {
    si: {
        profileUpdate: {
            email: {
                required: 'ඊමේල් අවශ්‍යයි',
                valid: 'ඊමේල් වලංගු නොවේ'
            },
            phone_number: {
                required: 'දුරකථන අංකය අවශ්‍යයි',
                valid: 'දුරකථන අංක ආකෘතිය වලංගු නොවේ'
            },
            avatar: {
                imageSizeSmall: 'රූප ප්‍රමාණය 150x150 පිකසල්ට වඩා වැඩි විය යුතුයි',
                success: 'අවටාරය යාවත්කාලීන කර ඇත',
                failed: ''
            },
            name: {
                required: 'නම අවශ්‍යයි'
            },
            gender: {
                required: 'ස්ත්‍රී පුරුෂ භාවය අවශ්‍යයි'
            },
            id_number: {
                required: 'හැඳුනුම් අංකය අවශ්‍යයි',
                valid: 'හැඳුනුම් අංකය වලංගු නොවේ'
            },
            city: {
                required: 'නගරය සම්පූර්ණ කරන්න'
            },
            success: 'පැතිකඩ සාර්ථකව යාවත්කාලීන විය'
        },
        partnerRegister: {
            affiliateCode: {
                required: 'සබැඳි කේතය අවශ්‍යයි'
            }
        },
        signupAsPartner: {
            success: 'რეგისტრაცია წარმატებით დასრულდა'
        },
        QRScanner: {
            ticket_number: {
                required: 'ටිකට් කේතය ඇතුළත් කරන්න'
            },
            cameraErrors: {
                NotAllowedError: 'ඔබට කැමරා ප්‍රවේශ අවසර ලබා දීමට අවශ්‍යයි',
                NotFoundError: 'මෙම උපකරණයේ කැමරා නැත',
                NotSupportedError: 'ආරක්ෂිත සන්දර්භය අවශ්‍යයි (HTTPS)',
                NotReadableError: 'කැමරාව දැනට භාවිතා වනවාද?',
                OverconstrainedError: 'ස්ථාපිත කැමරාවන් සුදුසු නොවේ',
                StreamApiNotSupportedError: 'Stream API මෙම බ්‍රවුසර්වලට සහය දක්වන්නේ නැත, කරුණාකර වෙනත් බ්‍රවුසර් භාවිතා කරන්න'
            },
            success: 'ටිකට් සාර්ථකව පරික්ෂා කර ඇත'
        },
        login: {
            phone_number: {
                required: 'දුරකථන අංකය අවශ්‍යයි'
            },
            password: {
                required: 'මුරපදය අවශ්‍යයි'
            },
            invalid_grant: 'දුරකථන අංකය හෝ මුරපදය වැරදියි'
        },
        signup: {
            phone_number: {
                required: 'දුරකථන අංකය අවශ්‍යයි'
            },
            password: {
                required: 'මුරපදය අවශ්‍යයි'
            },
            success: 'ගිණුම සාර්ථකව සෑදීමට හැකි විය, දැන් ඔබට පුරනය විය හැක'
        },
        changePassword: {
            old_password: {
                required: 'වර්තමාන මුරපදය අවශ්‍යයි'
            },
            password: {
                required: 'මුරපදය අවශ්‍යයි',
                match: 'මුරපද දෙකම සමාන නොවේ'
            },
            success: 'මුරපදය සාර්ථකව යාවත්කාලීන විය'
        },
        forgot: {
            success: 'මුරපදය සාර්ථකව එවමින් ඇත'
        },
        financialPrimarySet: {
            success: 'මූල්‍ය ක්‍රමය සාර්ථකව යාවත්කාලීන විය'
        },
        financialByTypeSet: {
            success: 'මූල්‍ය ක්‍රමය සාර්ථකව යාවත්කාලීන විය'
        },
        deleteFinancial: {
            success: 'ක්‍රමය ඉවත් කරන ලදි'
        },
        financialAdd: {
            bank: {
                your_name: {
                    required: 'ලැබීමේ ස්ථානය අවශ්‍යයි'
                },
                bank_name: {
                    required: 'බැංකු නාමය අවශ්‍යයි'
                },
                account_number: {
                    required: 'IBAN අවශ්‍යයි'
                },
                swift: {
                    required: 'SWIFT අවශ්‍යයි'
                }
            },
            success: 'මූල්‍ය ක්‍රමය එකතු කරන ලදි',
            update: 'මූල්‍ය ක්‍රමය යාවත්කාලීන කරන ලදි'
        },
        driversLicense: {
            license_number: {
                required: 'රියදුරු බලපත්‍ර අංකය අවශ්‍යයි'
            },
            front_side: {
                required: 'ඉදිරි පැත්තය අරඹන්න',
                wrongFormat: 'රූප ආකෘතිය වැරදියි',
                lessThan: 'රූප ප්‍රමාණය 4 MB ට වඩා කුඩා විය යුතුයි'
            },
            back_side: {
                required: 'පසුපස පැත්තය අරඹන්න',
                wrongFormat: 'රූප ආකෘතිය වැරදියි',
                lessThan: 'රූප ප්‍රමාණය 4 MB ට වඩා කුඩා විය යුතුයි'
            },
            active: 'ඔබගේ රියදුරු බලපත්‍රය අනුමත කරන ලදි',
            pending: 'ඔබගේ රියදුරු බලපත්‍රය අනුමත කිරීමට අනුමානයකි',
            rejected: 'ඔබගේ රියදුරු බලපත්‍රය පරික්ෂා නොකරයි',
            success: 'ඔබගේ රියදුරු බලපත්‍ර විස්තරයන් අනුමත කිරීමට යවා ඇත'
        },
        vehicleAdd: {
            type: {
                required: 'රථ වර්ගය තෝරන්න',
                invalid: 'රථ වර්ගය වැරදි වේ'
            },
            manufacturer: {
                required: 'කාර් මූලාශ්‍රය තෝරන්න'
            },
            model: {
                required: 'රථ මොඩලය ඇතුළත් කරන්න'
            },
            registration_country: {
                required: 'ලියාපදිංචි රට තෝරන්න'
            },
            license_number: {
                required: 'රථ වාහන අංකය අවශ්‍යයි'
            },
            year: {
                required: 'නව වසර අවශ්‍යයි'
            },
            date_of_registration: {
                required: 'ලියාපදිංචි දිනය අවශ්‍යයි'
            },
            front_side: {
                required: 'ඉදිරි පැත්තය අරඹන්න',
                wrongFormat: 'රූප ආකෘතිය වැරදියි',
                lessThan: 'රූප ප්‍රමාණය 4 MB ට වඩා කුඩා විය යුතුයි'
            },
            back_side: {
                required: 'පසුපස පැත්තය අරඹන්න',
                wrongFormat: 'රූප ආකෘතිය වැරදියි',
                lessThan: 'රූප ප්‍රමාණය 4 MB ට වඩා කුඩා විය යුතුයි'
            },
            success: 'მონაცემები წარმატებით გაიგზავნა შესამოწმებლად'
        },
        vehicleEdit: {
            success: 'රථ විස්තර සමාලෝචනය සඳහා යවා ඇත',
            active: 'රථ විස්තර අනුමත කර ඇත',
            pending: 'රථ විස්තර අනුමත කිරීමට අනුමානයකි',
            rejected: 'රථ විස්තර පරික්ෂා නොකරයි'
        },
        routeAdd: {
            success: 'මාර්ගය සාර්ථකව සෑදීම සම්පූර්ණ විය'
        },
        routeEdit: {
            success: 'මාර්ගය සාර්ථකව යාවත්කාලීන විය'
        },
        routeDelete: {
            success: 'මාර්ගය සාර්ථකව අවලංගු/ඉවත් කරන ලදි'
        },
        payoutAdd: {
            amount: {
                required: 'අඛණ්ඩ වශයෙන් මුදල ඇතුළත් කරන්න',
                number: 'ඉතිරි මුදල සත්‍ය ලෙස ඇතුළත් කරන්න',
                less: 'වත්මන් වටිනාකම දීමනාවක් සඳහා පසුබැසීමට නොමැත'
            },
            success: 'පරිපූර්ණ දීමනාව සාර්ථකව පවරන ලදි'
        },
        preserveRoute: {
            success: 'විස්තර සාර්ථකව යාවත්කාලීන විය'
        }
    },
    en: {
        profileUpdate: {
            email: {
                required: 'Email is required',
                valid: 'Email is invalid'
            },
            avatar: {
                imageSizeSmall: 'Image dimensions should be more than 150x150 pixels',
                success: 'Avatar has been updated'
            },
            gender: {
                required: 'Gender is required'
            },
            phone_number: {
                required: 'Phone number is required',
                valid: 'Phone number format is invalid'
            },
            name: {
                required: 'Name is required'
            },
            id_number: {
                required: 'ID number is required',
                valid: 'ID number is invalid'
            },
            city: {
                required: 'Please fill out the city field'
            },
            success: 'Profile successfully updated'
        },
        partnerRegister: {
            affiliateCode: {
                required: 'Affiliate code is required'
            }
        },
        QRScanner: {
            ticket_number: {
                required: 'Please enter ticket code'
            },
            success: 'Ticket has been successfully parsed',
            cameraErrors: {
                NotAllowedError: 'You need to grant camera access permission',
                NotFoundError: 'No camera on this device',
                NotSupportedError: 'Secure context required (HTTPS)',
                NotReadableError: 'Is the camera already in use?',
                OverconstrainedError: 'Installed cameras are not suitable',
                StreamApiNotSupportedError: 'Stream API is not supported in this browser, please try another browser'
            }
        },
        signupAsPartner: {
            success: 'Registration has been successfully completed'
        },
        login: {
            phone_number: {
                required: 'Phone number is required'
            },
            password: {
                required: 'Password is required'
            },
            invalid_grant: 'Phone number or password is incorrect'
        },
        signup: {
            phone_number: {
                required: 'Phone number is required'
            },
            password: {
                required: 'Password is required'
            },
            success: 'Account has been successfully created, you can log in now.'
        },
        changePassword: {
            old_password: {
                required: 'Current password is required'
            },
            password: {
                required: 'Password is required',
                match: 'Passwords don\'t match'
            },
            success: 'Password has been successfully updated'
        },
        changePhoneNumber: {
            phone_number: {
                required: 'Phone number is required',
                valid: 'Phone number format is invalid'
            },
            password: {
                required: 'Password is required',
            },
            otpCode: {
                required: 'OTP code is required'
            },
            success: 'Mobile number has been successfully updated'
        },
        forgot: {
            success: 'Password has been successfully sent'
        },
        financialPrimarySet: {
            success: 'Financial method has been successfully updated'
        },
        financialByTypeSet: {
            success: 'Financial method has been successfully updated'
        },
        deleteFinancial: {
            success: 'Method has been deleted'
        },
        financialAdd: {
            bank: {
                your_name: {
                    required: 'Beneficiary is required'
                },
                bank_name: {
                    required: 'Bank name is required'
                },
                account_number: {
                    required: 'IBAN is required'
                },
                swift: {
                    required: 'Swift is required'
                }
            },
            success: 'Financial method has been added',
            update: 'Financial method has been updated'
        },
        driversLicense: {
            license_number: {
                required: 'Driver\'s license number is required'
            },
            front_side: {
                required: 'Please upload the front side',
                wrongFormat: 'Image format is incorrect.',
                lessThan: 'Image size should be less than 4 MB'
            },
            back_side: {
                required: 'Please upload the back side',
                wrongFormat: 'Image format is incorrect.',
                lessThan: 'Image size should be less than 4 MB'
            },
            active: 'Your driver\'s license has been approved',
            pending: 'Your driver\'s license is pending for approval',
            rejected: 'Your driver\'s license has been rejected',
            success: 'Your driver\'s license details have been sent for approval'
        },
        vehicleAdd: {
            type: {
                required: 'Please select vehicle type',
                invalid: 'Vehicle type is invalid'
            },
            manufacturer: {
                required: 'Please select manufacturer'
            },
            model: {
                required: 'Please enter vehicle model'
            },
            registration_country: {
                required: 'Please select registration country'
            },
            license_number: {
                required: 'Vehicle plate number is required'
            },
            year: {
                required: 'Year of manufacture is required'
            },
            date_of_registration: {
                required: 'Date of registration is required'
            },
            front_side: {
                required: 'Please upload the front side',
                wrongFormat: 'Image format is incorrect.',
                lessThan: 'Image size should be less than 4 MB'
            },
            back_side: {
                required: 'Please upload the back side',
                wrongFormat: 'Image format is incorrect.',
                lessThan: 'Image size should be less than 4 MB'
            }
        },
        vehicleEdit: {
            success: 'Vehicle details have been sent to review',
            active: 'Vehicle details have been approved',
            pending: 'Vehicle details are pending for approval',
            rejected: 'Vehicle details have been rejected'
        },
        routeAdd: {
            success: 'Route has been successfully created'
        },
        routeEdit: {
            success: 'Route has been successfully updated'
        },
        routeDelete: {
            success: 'Route has been successfully canceled/deleted'
        },
        payoutAdd: {
            amount: {
                required: 'Please enter the amount',
                number: 'Please enter the valid amount',
                less: 'Current value is not enough for withdrawal'
            },
            success: 'Withdrawal request has been successfully sent'
        },
        preserveRoute: {
            success: 'Details have been successfully updated.'
        }
    },
    ta: {
        profileUpdate: {
            email: {
                required: 'மின்னஞ்சல் வேண்டும்',
                valid: 'மின்னஞ்சல் செல்லுபடியாகவில்லை'
            },
            avatar: {
                imageSizeSmall: 'படத்தின் அளவு 150x150 பிக்சல்களுக்கு மேல் இருக்க வேண்டும்',
                success: 'பயர்படம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
            },
            gender: {
                required: 'பாலினம் தேவையானது'
            },
            phone_number: {
                required: 'தொலைபேசி எண் தேவை',
                valid: 'தொலைபேசி எண் செல்லுபடியாகவில்லை'
            },
            name: {
                required: 'பெயர் தேவை'
            },
            id_number: {
                required: 'அடையாள எண் தேவை',
                valid: 'அடையாள எண் செல்லுபடியாகவில்லை'
            },
            city: {
                required: 'நகரம் பூர்த்தி செய்யவும்'
            },
            success: 'பொருந்திய புது விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        },
        partnerRegister: {
            affiliateCode: {
                required: 'சங்கமனை குறியீடு தேவை'
            }
        },
        QRScanner: {
            ticket_number: {
                required: 'டிக்கெட் குறியீடு பதிவு செய்யவும்'
            },
            success: 'டிக்கெட் வெற்றிகரமாக சரிபார்க்கப்பட்டது',
            cameraErrors: {
                NotAllowedError: 'கேமராவுக்கான அணுகல் அனுமதி தேவையானது',
                NotFoundError: 'இந்த சாதனத்தில் கேமரா இல்லை',
                NotSupportedError: 'பாதுகாப்பான சூழல் (HTTPS) தேவை',
                NotReadableError: 'கேமரா தற்போது பயன்படுத்தப்படுகிறதா?',
                OverconstrainedError: 'நிறுவப்பட்ட கேமரா ஏற்றதில்லை',
                StreamApiNotSupportedError: 'இந்த பிரவுசர் Stream API ஐ ஆதரிக்கவில்லை, தயவுசெய்து வேறு பிரவுசரை பயன்படுத்தவும்'
            }
        },
        signupAsPartner: {
            success: 'பதிவு வெற்றிகரமாக முடிந்தது'
        },
        login: {
            phone_number: {
                required: 'தொலைபேசி எண் தேவை'
            },
            password: {
                required: 'கடவுச்சொல் தேவை'
            },
            invalid_grant: 'தொலைபேசி எண் அல்லது கடவுச்சொல் தவறானது'
        },
        signup: {
            phone_number: {
                required: 'தொலைபேசி எண் தேவை'
            },
            password: {
                required: 'கடவுச்சொல் தேவை'
            },
            success: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது, தற்போது உள்நுழையலாம்'
        },
        changePassword: {
            old_password: {
                required: 'பழைய கடவுச்சொல் தேவை'
            },
            password: {
                required: 'கடவுச்சொல் தேவை',
                match: 'கடவுச்சொற்கள் ஒன்றாக இல்லை'
            },
            success: 'கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        },
        forgot: {
            success: 'கடவுச்சொல் மீண்டும் அனுப்பப்பட்டது'
        },
        financialPrimarySet: {
            success: 'நிதி அமைப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        },
        financialByTypeSet: {
            success: 'நிதி அமைப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        },
        deleteFinancial: {
            success: 'அமைப்பு நீக்கப்பட்டது'
        },
        financialAdd: {
            bank: {
                your_name: {
                    required: 'பெறுநர் பெயர் தேவை'
                },
                bank_name: {
                    required: 'பங்கிற்கு பெயர் தேவை'
                },
                account_number: {
                    required: 'IBAN தேவை'
                },
                swift: {
                    required: 'SWIFT தேவை'
                }
            },
            success: 'நிதி அமைப்பு சேர்க்கப்பட்டது',
            update: 'நிதி அமைப்பு புதுப்பிக்கப்பட்டது'
        },
        driversLicense: {
            license_number: {
                required: 'வாகன உரிமம் எண் தேவை'
            },
            front_side: {
                required: 'முன் பக்கம் கோரப்பட்டுள்ளது',
                wrongFormat: 'பட வடிவம் தவறானது',
                lessThan: 'பட அளவு 4 MB க்கும் குறைவாக இருக்க வேண்டும்'
            },
            back_side: {
                required: 'பின் பக்கம் கோரப்பட்டுள்ளது',
                wrongFormat: 'பட வடிவம் தவறானது',
                lessThan: 'பட அளவு 4 MB க்கும் குறைவாக இருக்க வேண்டும்'
            },
            active: 'உங்கள் டிரைவர் உரிமம் அனுமதிக்கப்பட்டது',
            pending: 'உங்கள் டிரைவர் உரிமம் அனுமதிக்கபட்டு உள்ளது',
            rejected: 'உங்கள் டிரைவர் உரிமம் பரிசோதிக்கப்படவில்லை',
            success: 'உங்கள் டிரைவர் உரிமம் விவரங்கள் அனுமதிக்க அனுப்பப்பட்டுள்ளது'
        },
        vehicleAdd: {
            type: {
                required: 'வாகன வகையைத் தேர்வு செய்யவும்',
                invalid: 'வாகன வகை தவறானது'
            },
            manufacturer: {
                required: 'கார் தயாரிப்பாளர் தேர்வு செய்யவும்'
            },
            model: {
                required: 'வாகன மாடல் பதிவு செய்யவும்'
            },
            registration_country: {
                required: 'பதிவேற்றும் நாடு தேர்வு செய்யவும்'
            },
            license_number: {
                required: 'வாகன எண் தேவை'
            },
            year: {
                required: 'வருடம் தேவை'
            },
            date_of_registration: {
                required: 'பதிவேற்ற தேதி தேவை'
            },
            front_side: {
                required: 'முன் பக்கம் கோரப்பட்டுள்ளது',
                wrongFormat: 'பட வடிவம் தவறானது',
                lessThan: 'பட அளவு 4 MB க்கும் குறைவாக இருக்க வேண்டும்'
            },
            back_side: {
                required: 'பின் பக்கம் கோரப்பட்டுள்ளது',
                wrongFormat: 'பட வடிவம் தவறானது',
                lessThan: 'பட அளவு 4 MB க்கும் குறைவாக இருக்க வேண்டும்'
            }
        },
        vehicleEdit: {
            success: 'வாகன விவரங்கள் பரிசீலனைக்கு அனுப்பப்பட்டது',
            active: 'வாகன விவரங்கள் அனுமதிக்கப்பட்டது',
            pending: 'வாகன விவரங்கள் அனுமதிக்கப் போகின்றன',
            rejected: 'வாகன விவரங்கள் பரிசோதிக்கப்படவில்லை'
        },
        routeAdd: {
            success: 'பாதை வெற்றிகரமாக உருவாக்கப்பட்டது'
        },
        routeEdit: {
            success: 'பாதை வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        },
        routeDelete: {
            success: 'பாதை வெற்றிகரமாக நீக்கப்பட்டது'
        },
        payoutAdd: {
            amount: {
                required: 'தொகை பதிவு செய்யவும்',
                number: 'தொகை எண் சரியானதாக இருக்க வேண்டும்',
                less: 'தற்போதைய தொகையில் இறுதியில் பணம் இல்லாமல் உள்ளது'
            },
            success: 'பூரண பணம் வெற்றிகரமாக பரிமாற்றப்பட்டது'
        },
        preserveRoute: {
            success: 'விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        }
    }
}
