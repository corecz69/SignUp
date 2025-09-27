# React Code Improvements

## 🔴 CRITICAL - Fix Now

### Missing key props
```tsx
// fe/src/routes/app/debug/signs.tsx:24
{signs.map(sign => (
    <SignCard key={sign.signId} // ADD THIS
        signId={sign.signId.toString()}
        // ...
    />
))}
```

### Invalid JSX comments
```tsx
// fe/src/components/cards/sign-card.tsx:20
{/* TODO routing */} // USE THIS FORMAT
// //TODO routing  // NOT THIS
```

## 🟡 IMPORTANT - Fix Soon

### Replace console.log with routing
```tsx
// fe/src/components/cards/sign-card.tsx:21,37
const navigate = useNavigate()
onClick={() => navigate({ to: `/sign/${signId}` })}
// Instead of console.log
```

### Add error boundaries
```tsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
    <SignCard {...props} />
</ErrorBoundary>
```

## 🟢 FUTURE - Good to have

### Performance optimization
```tsx
export const SignCard = memo<Props>(({ ... }) => {
```

### Styled components over sx
```tsx
const StyledCard = styled(Card)(({ theme }) => ({
    minWidth: 200,
    // Better than sx prop
}))
```

### Better TypeScript
```tsx
translations: readonly string[]  // Instead of string[]
```

### Project structure
```
src/
  hooks/          // Custom hooks
  types/          // Shared types
  components/
    common/       // Shared components
    cards/        // Entity cards
```

## Priority Order
1. Fix key props (React warnings)
2. Fix JSX comments (syntax error)
3. Implement routing (core functionality)
4. Add error handling (stability)
5. Performance & structure (polish)