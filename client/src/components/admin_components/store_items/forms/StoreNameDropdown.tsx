type DropdownData = {
  key: string;
  text: string;
  value: string;
}
const StoreNameDropDown: React.FC<DProps> = ({ state, dispatch }): JSX.Element => {
  const [ dropdownState, setDropdownState ] = useState<DropdownData[]>();
  const { loadedStores } = state.storeState;

  const handleSearchChange = (e: React.SyntheticEvent, data: DropdownProps): void => {
    console.log(31);
    console.log(e)
    console.log(data.value);
    const queryOptions = {
      storeName: data.value as string
    }
    getAllStoreItems(dispatch, queryOptions)
  }
  useEffect(() => {
    getAllStores(dispatch)
  }, [])
  useEffect(() => {
    const dropdownData = loadedStores.map((store) => {
      return {
        key: store._id,
        text: capitalizeString(store.title),
        value: store.title
      }
    });
    setDropdownState(() => {
      return [ ...dropdownData ];
    })
  }, [loadedStores]);
  return (
    <Dropdown
      placeholder={"Filter by Store name"}
      selection
      onChange={handleSearchChange}
      options={dropdownState}
    />
  )
}