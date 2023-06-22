
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnAndroidPdfSpec.h"

@interface RnAndroidPdf : NSObject <NativeRnAndroidPdfSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnAndroidPdf : NSObject <RCTBridgeModule>
#endif

@end
