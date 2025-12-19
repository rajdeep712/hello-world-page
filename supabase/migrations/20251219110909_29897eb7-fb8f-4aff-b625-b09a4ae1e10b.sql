-- Create function to validate phone number format (10 digits)
CREATE OR REPLACE FUNCTION public.validate_phone_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate if phone is being set (not null)
  IF NEW.phone IS NOT NULL THEN
    -- Check if phone is exactly 10 digits
    IF NOT (NEW.phone ~ '^\d{10}$') THEN
      RAISE EXCEPTION 'Phone number must be exactly 10 digits';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to prevent phone number changes once set
CREATE OR REPLACE FUNCTION public.prevent_phone_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If old phone was set (not null) and trying to change it
  IF OLD.phone IS NOT NULL AND OLD.phone != '' THEN
    -- Prevent any change to phone (including setting to null or different value)
    IF NEW.phone IS DISTINCT FROM OLD.phone THEN
      RAISE EXCEPTION 'Phone number cannot be changed once set';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for phone validation on insert
CREATE TRIGGER validate_phone_on_insert
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_phone_number();

-- Create trigger for phone validation on update
CREATE TRIGGER validate_phone_on_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_phone_number();

-- Create trigger to prevent phone changes once set
CREATE TRIGGER prevent_phone_change_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_phone_change();