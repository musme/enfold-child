import {
  useState,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  isValidElement,
  cloneElement,
  useLayoutEffect,
} from "@wordpress/element";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useHover,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  useId,
} from "@floating-ui/react";

export function usePopover({
  initialOpen = false,
  placement = "bottom",
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState();
  const [descriptionId, setDescriptionId] = useState();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(20),
      flip({
        fallbackAxisSideDirection: "end",
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const hover = useHover(context);

  const interactions = useInteractions([click, dismiss, role, hover]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

const PopoverContext = createContext(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);

  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
};

export function Popover({ children, modal = false, ...restOptions }) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = forwardRef(function PopoverTrigger(
  { children, asChild = false, ...props },
  propRef
) {
  const context = usePopoverContext();
  const childrenRef = children.ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      })
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      // The user can style the trigger based on the state
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverContent = forwardRef(function PopoverContent(
  props,
  propRef
) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{
            ...context.floatingStyles,
            ...props.style,
          }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

export const PopoverHeading = forwardRef(function PopoverHeading(
  { children, ...props },
  ref
) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  );
});

export const PopoverDescription = forwardRef(function PopoverDescription(
  { children, ...props },
  ref
) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  );
});

export const PopoverClose = forwardRef(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});
