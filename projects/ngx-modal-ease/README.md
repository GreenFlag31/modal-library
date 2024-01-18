# ngx-modal-ease

# Description

ngx-modal-ease is a versatile Angular library providing a lightweight, simple, and performant modal. This library supports data communication between components, opening of multiple modals, custom animations, and a range of customisable options.

Support Angular version starts at v17.

# Demo

Live demonstration of the ngx-modal-ease library [here](https://greenflag31.github.io/modal-library/ngx-modal-ease).

# Installation

You can install the library using the following command:

```
npm i ngx-modal-ease
```

# Options

The modal supports a range of customisable options:

```
Options {
  modal?: {
    enter?: string;
    leave?: string;
    top?: string;
    left?: string;
  };
  overlay?: {
    enter?: string;
    leave?: string;
    backgroundColor?: string;
  };
  size?: {
    height?: string;
    maxHeight?: string;
    width?: string;
    maxWidth?: string;
    padding?: string;
  };
  actions?: {
    escape?: boolean;
    click?: boolean;
  };
  data?: {
    [key: string]: unknown;
  };
}
```

| Name                                                           | Default                                                            | Description                                                                                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span style="background-color:#f2f2f2;">enter</span>           | <span style="background-color:#f2f2f2;"></span>                    | <span style="background-color:#f2f2f2;">Define the enter animation for the modal or the overlay respecting the [shorthand animation property](https://developer.mozilla.org/en-US/docs/Web/CSS/animation).</span> |
| leave                                                          |                                                                    | Define the leave animation for the modal or the overlay respecting the [shorthand animation property](https://developer.mozilla.org/en-US/docs/Web/CSS/animation).                                                |
| <span style="background-color:#f2f2f2;">top</span>             | <span style="background-color:#f2f2f2;">50</span>                  | <span style="background-color:#f2f2f2;">Top position of the modal in percent. Can be defined in any measure unit.</span>                                                                                          |
| left                                                           | 50                                                                 | Left position of the modal in percent. Can be defined in any measure unit.                                                                                                                                        |
| <span style="background-color:#f2f2f2;">backgroundColor</span> | <span style="background-color:#f2f2f2;">rgba(0, 0, 0, 0.4);</span> | <span style="background-color:#f2f2f2;">Background color of the overlay. Can be defined in any color notation (rgba, hex, hsl, ...).</span>                                                                       |
| <span style="background-color:#f2f2f2;">minHeight</span>       | <span style="background-color:#f2f2f2;"></span>                    | <span style="background-color:#f2f2f2;">Minimum height of the modal. Can be defined in any measure unit.</span>                                                                                                   |
| <span style="background-color:#f2f2f2;">height</span>          | <span style="background-color:#f2f2f2;"></span>                    | <span style="background-color:#f2f2f2;">Height of the modal. Can be defined in any measure unit.</span>                                                                                                           |
| <span style="background-color:#f2f2f2;">width</span>           | <span style="background-color:#f2f2f2;"></span>                    | <span style="background-color:#f2f2f2;">Width of the modal. Can be defined in any measure unit.</span>                                                                                                            |
| <span style="background-color:#f2f2f2;">maxWidth</span>        | <span style="background-color:#f2f2f2;">100</span>                 | <span style="background-color:#f2f2f2;">Max width of the modal in percent. Can be defined in any measure unit.</span>                                                                                             |
| <span style="background-color:#f2f2f2;">padding</span>         | <span style="background-color:#f2f2f2;">0.5</span>                 | <span style="background-color:#f2f2f2;">Padding to be applied on the modal in rem. Can be defined in any measure unit.</span>                                                                                     |
| <span style="background-color:#f2f2f2;">escape</span>          | <span style="background-color:#f2f2f2;">true</span>                | <span style="background-color:#f2f2f2;">Enable escape to close the current modal.</span>                                                                                                                          |
| <span style="background-color:#f2f2f2;">click</span>           | <span style="background-color:#f2f2f2;">true</span>                | <span style="background-color:#f2f2f2;">Enable click outside of the modal to close the current modal.</span>                                                                                                      |
| <span style="background-color:#f2f2f2;">data</span>            | <span style="background-color:#f2f2f2;"></span>                    | <span style="background-color:#f2f2f2;">Data communication between components under the form of key-value pairs. Any type of data is supported.</span>                                                            |

# Complete Example

Inject the ModalService through regular dependency injection in your component.

In the following example, `ModalContentComponent` is the content of the modal and should be provided as first parameter. As second parameter, provide an object respecting the `Options` interface (see above).

```
  this.modalService.open(ModalContentComponent, {
    modal: {
      <!-- animation -->
      enter: 'enter-scale-down 0.1s ease-out',
    },
    overlay: {
      <!-- animation -->
      leave: 'fade-out 0.3s',
    },
    size: {
      <!-- modal configuration -->
      width: '400px',
    },
    data: {
      <!-- data to ModalContentComponent -->
      type: 'Angular modal library',
    },
  })
  .subscribe((dataFromModalContentComponent) => {
    ...
  });
```

Any type of data can be provided between components. Create the corresponding property (here, `type`) in your component (here, `ModalContentComponent`) and the property will be assigned with the provided value.

In your `ModalContentComponent`:
To pass information from the `ModalContentComponent` to your current component, inject the `ModalService` through regular dependency injection and call the `close(data)` method from the service with any data you wish to send back to your component. This method returns an RxJs subject, so subscribe to it as shown in the above example. It is not necessary to unsubscribe from the subscription since it will automatically `complete()` in the service.

```
  <!-- Inside ModalContentComponent -->
  onClose() {
    this.modalService.close(this.dataToSendBack);
  }
```

Publicly available methods have been exhaustively documented and typed, so you should get autocomplete and help from your code editor. Press on `CTRL + space` to get help on the available properties in the `Options` object.

# ModalService

This library exposes a `ModalService` that contains the following API:

```
<!-- Opens a component inside the modal -->
open<C>(componentToCreate: Type<C>, options?: Options);

<!-- Close a modal with optional data to send back -->
close(data?: unknown);

<!-- Close all opened modals -->
closeAll();
```

NB: Z-index of overlay and modal start at 1000 and 2000 respectively. In case of multiple modals, z-indexes will be incremented by 1000.

# Ready-to-use animations keyframes

This library comes with predefined and ready-to-use animations keyframes. Just fill in the `name`, `duration` and `easing function` (more info on the `animation CSS shorthand` [here](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)). Those animations are _position agnostic_, so if you wish to position your modal at other `top` and `left` values than default, it will correctly work. Of course, you can create your own keyframes too.

```
/* Recommended: 0.2s ease-out */
@keyframes enter-going-down {
  from {
    transform: translate(-50%, -60%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}

/* Recommended: 0.2s linear */
@keyframes enter-scaling {
  from {
    transform: scale(0.8) translate(-50%, -50%);
    transform-origin: left;
  }
  to {
    transform: scale(1) translate(-50%, -50%);
    transform-origin: left;
  }
}

/* Recommended: 0.1s ease-out */
@keyframes enter-scale-down {
  from {
    transform: scale(1.5) translate(-50%, -60%);
    transform-origin: left;
  }
  to {
    transform: scale(1) translate(-50%, -50%);
    transform-origin: left;
  }
}

/* Recommended: 0.3s linear */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Recommended: 0.3s linear */
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Recommended: 0.7s linear */
@keyframes bounce-in {
  0% {
    transform: translate(-50%, -85%);
  }
  18% {
    transform: translate(-50%, -50%);
  }
  60% {
    transform: translate(-50%, -65%);
  }
  80% {
    transform: translate(-50%, -50%);
  }
  90% {
    transform: translate(-50%, -53%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}

/* Recommended: 1s linear */
@keyframes scale-rotate {
  30% {
    transform: scale(1.05) translate(-50%, -50%);
    transform-origin: left;
  }
  40%,
  60% {
    transform: rotate(-3deg) scale(1.05) translate(-50%, -50%);
    transform-origin: left;
  }
  50% {
    transform: rotate(3deg) scale(1.05) translate(-50%, -50%);
    transform-origin: left;
  }
  70% {
    transform: rotate(0deg) scale(1.05) translate(-50%, -50%);
    transform-origin: left;
  }
  100% {
    transform: scale(1) translate(-50%, -50%);
    transform-origin: left;
  }
}
```

If you create your own keyframes, I would recommend to create a new file `modal-animations` (.css or preprocessor), and @import it in your `styles.css` (or preprocessor) at the root of the application.

# SSR (Server Side Rendering)

This library supports Server Side Rendering (SSR). The modal will not instantiate during server-side execution, as it requires access to the DOM API.

# DX Friendly

This library has been documented and should provide autocomplete and help from your code editor. Tested on VS Code.

# Performance

Emphasis has been placed on performance, adopting `ChangeDetectionStrategy.OnPush` strategy. This library respects Angular's mindset and use the Angular API to create components. Modal components will be removed from the DOM after closing.

# Change log

# Report a Bug

Please provide a detailed description of the encountered bug, including your options and the steps/actions that led to the issue. An accurate description will help me to reproduce the issue.
