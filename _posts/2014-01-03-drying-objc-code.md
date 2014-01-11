---
layout: article
title:  "DRYing Objective-C code"
date:   2014-01-03 10:50:00
categories: software development, ios
---
DRY is a great methodology. It makes writing code easier and cleaner. There are many ways to write DRY code in Objective-C.

## Categories

Categories are a good way to write specific code once. For example we can use category to setup custom views and behaviors or add additional functionality.

```objective-c
// UITableViewCell+DRYCategory.h

@interface UITableViewCell (DRYCategory)

- (void)dry_setSelectedBackgroundColor:(UIColor *)color;

@end

// UITableViewCell+DRYCategory.m

@implementation UITableViewCell (SDSAdditions)

- (void)dry_setSelectedBackgroundColor:(UIColor *)color {
    UIView *selectedBackgroundView = [[UIView alloc] initWithFrame:self.backgroundView.frame];
    [selectedBackgroundView setBackgroundColor:color];
    [self setSelectedBackgroundView:selectedBackgroundView];
}

@end
```
As a general rule, when adding methods to categories, make sure to insert prefix and unserscore as shown in the sample code above.

## Subclassing

Subclassing is the most natural way to avoid copying and pasting, which makes changes easier. As an example you can look at the code from one of my open source projects - [RDVKeyboardAvoiding](https://github.com/robbdimitrov/RDVKeyboardAvoiding). I've isolated the repeating code inside a [UIScrollView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIScrollView_Class/Reference/UIScrollView.html) subclass and made it reusable. The header file is clean and simple, making the class easy to use drop-in replacement of [UIScrollView](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIScrollView_Class/Reference/UIScrollView.html).

```objective-c
// RDVKeyboardAvoidingScrollView.h

@interface RDVKeyboardAvoidingScrollView : UIScrollView

/**
 * Returns the currently active view.
 */
@property (nonatomic, readonly) UIView *activeTextView;

@end

// RDVKeyboardAvoidingScrollView.m

@interface RDVKeyboardAvoidingScrollView () <UIGestureRecognizerDelegate> {
    UIView *_activeTextView;
}

@property (getter = isKeyboardShown) BOOL keyboardShown;
@property (strong) UIGestureRecognizer *tapGestureRegognizer;

@end

@implementation RDVKeyboardAvoidingScrollView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self configureKeyboardAvoiding];
    }
    return self;
}

...

- (UIView *)activeTextView {
    if (![_activeTextView isFirstResponder]) {
        for (UIView *view in [self subviews]) {
            if ([view isFirstResponder]) {
                _activeTextView = view;
                break;
            }
        }
    }
    return _activeTextView;
}

...

@end
```

## Constants

Every project - no matter how big it is, needs constants. They can be preprocessor macros, defines, typedefs. A good practice is to have a constants file inside your project. For example, this is the constants file from [RDVToolkit](https://github.com/robbdimitrov/RDVToolkit) - open source project, which contains categories, views and controllers.

```objective-c
// DRYConstants.h

#ifdef DEBUG
#define DLog(...) NSLog(__VA_ARGS__)
#else
#define DLog(...) /* */
#endif
#define ALog(...) NSLog(__VA_ARGS__)

#define RDVRectMake(x, y, width, height) \
CGRectMake(roundf(x), roundf(y), roundf(width), roundf(height))

#ifndef RDVTOOLKIT_RDVCONSTANTS__H
#define RDVTOOLKIT_RDVCONSTANTS__H

typedef void (^simpleBlock)(void);
typedef void (^boolBlock)(BOOL status);
typedef void (^errorBlock)(NSError *error);

#endif
```

As a sidenote, DRY your imports. There are several ways. One is to add files, imported in multiple places, to your `.pch` precompiled header. Other option is to use the newly introduced [Modules](http://stackoverflow.com/questions/18947516/import-vs-import-ios-7).

## Classes

A good practice with similar classes is to use [NS_ENUM](http://nshipster.com/ns_enum-ns_options/) type and change the appearance / functionality accordingly. In a project, I've worked on, there were two almost identical view controllers for different kinds of signup. One was for facebook, the oher for a service's account. It was painful to copy and paste code for every design change. The solution was to make one view controller out of the two. Below is part of the code.

```objective-c
// DRYServiceSelectionViewController.h

typedef NS_ENUM(NSInteger, DRYCreateProfileType) {
    DRYCreateProfileTypeSignup = 0,
    DRYCreateProfileTypeFacebook,
};

@interface DRYCreateProfileViewController : UIViewController

@property DRYCreateProfileType type;

@end

// DRYServiceSelectionViewController.m

- (void)createButtonTapped:(id)sender {
	...
	if ([self type] == SDSCreateProfileTypeSignup) {
    	// Create normal profile
    	...
    } else {
       	// Use facebook information
       	...
    }
}
```

## Blocks

Blocks are an awesome tool. Introduced in iOS 4.0 they became very popular throuout both Apple's code and open source. They can be used to clean your code from repeating lines. A good and simple solution is when creating a method with optional animation.

```objective-c
// RDVSelectionView.m

simpleBlock animationBlock = ^{
	...
};

boolBlock completionBlock = ^(BOOL status){
	...
};

if (animated) {
	[UIView animateWithDuration:0.3
              		 animations:animationBlock
               		 completion:completionBlock];
} else {
	animationBlock();
	completionBlock(YES);
}
```

## Conclusion

These are my 5 cents on DRYing Objective-C. All the code listed here is available on GitHub and is MIT licensed.