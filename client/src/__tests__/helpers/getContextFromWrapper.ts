import { ShallowWrapper } from "enzyme";
import { IGlobalAppContext } from "../../state/Store";

type WrapperProps = {
  value: IGlobalAppContext;
}
const getContextFromWrapper = (wrapper: ShallowWrapper): IGlobalAppContext => {
  const props = wrapper.props() as WrapperProps;
  const globalAppContext = props.value;
  return globalAppContext;
}
export default getContextFromWrapper;