'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button, Card, CardContent, CardActions, Grid } from '@mui/material'
import { collection, query, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2} p={2} sx={{ backgroundColor: '#f0f8ff' }}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: '90%', sm: 400 }}
          bgcolor="pink"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{ backgroundColor: '#ffb6c1', '&:hover': { backgroundColor: '#ff69b4' } }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="100%" maxWidth="800px" p={2} display="flex" flexDirection="column" alignItems="center">
        <Box
          width="100%"
          bgcolor="#e6e6fa"
          border="2px solid #ff1493" // Dark pink border add it to the border of the Inventory Items
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          mb={2}
        >
          <Typography variant="h4" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          mb={2}
        >
          <TextField
            variant="outlined"
            label="Search Items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '100%', maxWidth: '600px', backgroundColor: '#e6e6fa', borderRadius: 1, marginRight: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => handleOpen()}
            sx={{ backgroundColor: '#9370db', '&:hover': { backgroundColor: '#8a2be2' }, width: 'auto' }}
          >
            Add New Item
          </Button>
        </Box>
        <Box width="100%" mb={4}> {/* Added margin-bottom here */}
          <Grid container spacing={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.02)',
                      transition: '0.3s',
                    },
                    backgroundColor: '#ffffff'
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#6a5acd' }}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Quantity: {quantity}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => addItem(name)}
                      sx={{ backgroundColor: '#b0e0e6', '&:hover': { backgroundColor: '#87ceeb' } }}
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      onClick={() => removeItem(name)}
                      sx={{ backgroundColor: '#ffb6c1', '&:hover': { backgroundColor: '#ff69b4' } }}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
