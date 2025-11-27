import workingGif from './assets/working-on.gif'

export default function WorkingOn() {
  return (
    <div className="text-center w-100">
      <img
        src={workingGif}
        alt="En construcción"
        className="img-fluid rounded-4 shadow"
        style={{ maxHeight: '70vh', objectFit: 'contain' }}
      />
      <p className="text-secondary mt-3 mb-0">Estamos trabajando para traerte algo genial</p>
    </div>
  )
}


